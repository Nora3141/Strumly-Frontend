import { IntegerType, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface FilterDoc extends BaseDoc {
  postID: ObjectId;
  tags: Array<IntegerType>;
}

export default class FilteringConcept {
  public readonly filters: DocCollection<FilterDoc>;
  public readonly ALL_TAGS = ["Guitar", "Piano", "Voice", "Drums", "Easy", "Medium", "Hard"];

  constructor(collectionName: string) {
    this.filters = new DocCollection<FilterDoc>(collectionName);
  }

  async addTag(postID: ObjectId, tagName: string) {
    const filter = await this.filters.readOne({ postID: postID });
    const tagNameIdx = this.ALL_TAGS.indexOf(tagName);
    if (tagNameIdx == -1) {
      throw new Error("This tag name is not allowed, must be one of the pre-set tag names.");
    }
    if (!filter) {
      await this.filters.createOne({ postID: postID, tags: [tagNameIdx] });
    } else {
      const prev_list = filter.tags;
      if (prev_list.includes(tagNameIdx)) {
        throw new Error("This tag already exists on this post.");
      }
      prev_list.push(tagNameIdx);
      const filterID = filter._id;
      await this.filters.partialUpdateOne({ _id: filterID }, { tags: prev_list });
    }
    return { msg: "Tag successfully added!" };
  }

  async removeTag(postID: ObjectId, tagName: string) {
    const filter = await this.filters.readOne({ postID: postID });
    const tagNameIdx = this.ALL_TAGS.indexOf(tagName);
    if (tagNameIdx == -1) throw new Error("This tag does not exist on this post.");
    if (!filter || !filter.tags.includes(tagNameIdx)) throw new Error("This tag does not exist on this post.");
    else {
      const newArray = filter.tags.filter((e) => e !== tagNameIdx);
      const _id = filter._id;
      await this.filters.partialUpdateOne({ _id }, { postID: postID, tags: newArray });
    }
    return "Tag successfully removed!";
  }

  async getTagsOnPost(postID: ObjectId) {
    console.log("in filtering getting tags on post!!!");
    const filter = await this.filters.readOne({ postID: postID });
    if (!filter) {
      console.log("no filter found");
      return [];
    }
    console.log("filter found!", filter.tags);
    const result = [];
    for (let i = 0; i < filter.tags.length; i++) {
      const tagIdx = Number(filter.tags[i]);
      result.push(this.ALL_TAGS[tagIdx]);
    }
    return result;
  }

  async getPostsByTags(tagNames: string) {
    console.log("getPostsByTags called in filtering on tagNames: ", tagNames);
    const tags = tagNames.replace(/\s+/g, "").split(",");
    let filtered = await this.filters.readMany({});
    for (let i = 0; i < tags.length; i++) {
      const newFiltered: FilterDoc[] = [];
      const tagName = tags[i];
      const idx = this.ALL_TAGS.indexOf(tagName);
      if (idx == -1) {
        return []; // for not included tags, just return an empty list
      }
      filtered.forEach((entry) => {
        if (entry.tags.includes(idx)) newFiltered.push(entry);
      });
      filtered = newFiltered;
    }

    const postIDs: Array<ObjectId> = [];
    filtered.forEach((entry) => {
      postIDs.push(entry.postID);
    });
    return postIDs;
  }

  async deletePostStorage(postID: ObjectId) {
    return await this.filters.deleteOne({ postID: postID });
  }
}
