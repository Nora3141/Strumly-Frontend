import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface FavoriteDoc extends BaseDoc {
  user: ObjectId; // user id
  favoritedPost: ObjectId; // post id
}

export default class FavoritingConcept {
  public readonly favorites: DocCollection<FavoriteDoc>;

  constructor(collectionName: string) {
    this.favorites = new DocCollection<FavoriteDoc>(collectionName);
  }

  async toggleFavorite(userID: ObjectId, postID: ObjectId) {
    // check if favorited already
    const favorite = await this.favorites.readOne({ user: userID, favoritedPost: postID });
    if (favorite == null) {
      await this.favorites.createOne({ user: userID, favoritedPost: postID });
      return "favorited";
    } else {
      await this.favorites.deleteOne({ favoritedPost: postID });
      return "unfavorited";
    }
  }

  async isFavorited(userID: ObjectId, postID: ObjectId) {
    // check if favorited already
    const favorite = await this.favorites.readOne({ user: userID, favoritedPost: postID });
    if (favorite == null) {
      return false;
    } else {
      return true;
    }
  }

  async getFavoritedByUser(userID: ObjectId) {
    const favs = await this.favorites.readMany({ user: userID });
    const result: Array<ObjectId> = [];
    favs.forEach((favorite) => {
      result.push(favorite.favoritedPost);
    });
    return result;
  }

  async getFavoriteCount(postID: ObjectId) {
    const favs = await this.favorites.readMany({ favoritedPost: postID });
    return favs.length;
  }

  async getMostFavorited(postIDs: ObjectId[], numToGet: number) {
    console.log("getting top ", numToGet, "favorited out of: ", postIDs);
    // if (postIDs.length <= numToGet) return postIDs;

    const mapped = await Promise.all(
      postIDs.map(async (id: ObjectId) => {
        const favoritesOfPost = await this.favorites.readMany({ favoritedPost: id });
        return { count: favoritesOfPost.length, id };
      }),
    );
    mapped.sort((a, b) => b.count - a.count);

    const result = [];
    for (let i = 0; i < numToGet && i < mapped.length; i++) {
      if (mapped[i].count > 0) {
        result.push(mapped[i].id);
      }
    }
    return result;
  }
}
