/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bookmarks from "../bookmarks.js";
import type * as comments from "../comments.js";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as messages_index from "../messages/index.js";
import type * as notes_index from "../notes/index.js";
import type * as notes_notes from "../notes/notes.js";
import type * as notifications from "../notifications.js";
import type * as posts_index from "../posts/index.js";
import type * as users_index from "../users/index.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  bookmarks: typeof bookmarks;
  comments: typeof comments;
  conversations: typeof conversations;
  http: typeof http;
  "messages/index": typeof messages_index;
  "notes/index": typeof notes_index;
  "notes/notes": typeof notes_notes;
  notifications: typeof notifications;
  "posts/index": typeof posts_index;
  "users/index": typeof users_index;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
