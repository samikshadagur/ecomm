import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Initialize an empty userProductMatrix
const userProductMatrix = [];

// Function to calculate similarity between users
function calculateSimilarity(user1, user2) {
  let similarity = 0;
  for (let i = 0; i < user1.length; ++i) {
    if (user1[i] === 1 && user2[i] === 1) {
      similarity++;
    }
  }
  return similarity;
}

// Function to recommend items based on collaborative filtering
function recommendedItems(targetUserId, userProductMatrix) {
  const userSimilarities = [];

  for (let i = 0; i < userProductMatrix.length; ++i) {
    if (i !== targetUserId) {
      const similarity = calculateSimilarity(
        userProductMatrix[targetUserId],
        userProductMatrix[i]
      );
      userSimilarities.push({ userId: i, similarity });
    }
  }

  userSimilarities.sort((a, b) => b.similarity - a.similarity);

  const recommendedItems = new Array(
    userProductMatrix[targetUserId].length
  ).fill(0);

  for (const user of userSimilarities) {
    for (let i = 0; i < userProductMatrix[user.userId].length; ++i) {
      if (
        userProductMatrix[user.userId][i] === 1 &&
        userProductMatrix[targetUserId][i] === 0
      ) {
        recommendedItems[i] = 1;
      }
    }
  }

  return recommendedItems;
}

// Fetch user interactions from the database and generate recommendations

export async function getUserInteractionsForLoggedInUser(
  userId,
  userProductMatrix
) {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      console.log("User not found in the database.");
      return [];
    }

    // Fetch user's interactions from the database
    const userModelInteractions = user.interactions || [];

    // Mark the interactions in the matrix
    userModelInteractions.forEach((productId) => {
      if (productId >= 0 && productId < userProductMatrix[userId].length) {
        userProductMatrix[userId][productId] = 1;
      }
    });

    // Perform collaborative filtering and recommend items
    const recommendedItems = recommendedItems(userId, userProductMatrix);
    return recommendedItems;
  } catch (error) {
    console.error("Error fetching user interactions:", error);
    return [];
  }
}

// Fetch the number of users and products from the database and call getUserInteractionsForLoggedInUser
export async function fetchUserAndProductCounts(userId) {
  try {
    await mongoose.connect(
      "mongodb+srv://samikshdagur:Samiksha0004@cluster0.ezlsesh.mongodb.net/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    if (mongoose.connection.readyState === 1) {
      const numUsersPromise = userModel.countDocuments({});
      const numProductsPromise = productModel.countDocuments({});

      const [numUsers, numProducts] = await Promise.all([
        numUsersPromise,
        numProductsPromise,
      ]);

      const userProductMatrix = [];

      for (let i = 0; i < numUsers; i++) {
        userProductMatrix.push(new Array(numProducts).fill(0));
      }

      // Pass the userId to getUserInteractionsForLoggedInUser
      const recommendedItems = await getUserInteractionsForLoggedInUser(
        userId,
        userProductMatrix
      );

      console.log(
        "Recommended items for user " +
          userId +
          ": " +
          recommendedItems.join(", ")
      );
    }

    // Disconnect from MongoDB when done
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error fetching the number of users or products:", error);
  }
}

// Call the function to fetch user and product counts
fetchUserAndProductCounts();
