/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_admin from "../admin/admin.js";
import type * as admin_getUsersWithRanks from "../admin/getUsersWithRanks.js";
import type * as bookmarks from "../bookmarks.js";
import type * as collections from "../collections.js";
import type * as comments from "../comments.js";
import type * as conversations_index from "../conversations/index.js";
import type * as files from "../files.js";
import type * as games_spy_categories from "../games/spy/categories.js";
import type * as games_spy_classic_categories from "../games/spy/classic/categories.js";
import type * as games_spy_classic_categorySelection from "../games/spy/classic/categorySelection.js";
import type * as games_spy_classic_game from "../games/spy/classic/game.js";
import type * as games_spy_classic_gameEnd from "../games/spy/classic/gameEnd.js";
import type * as games_spy_classic_nextRound from "../games/spy/classic/nextRound.js";
import type * as games_spy_classic_result from "../games/spy/classic/result.js";
import type * as games_spy_classic_roundVoting from "../games/spy/classic/roundVoting.js";
import type * as games_spy_classic_tieBreak from "../games/spy/classic/tieBreak.js";
import type * as games_spy_classic_tieBreakVoting from "../games/spy/classic/tieBreakVoting.js";
import type * as games_spy_classic_turns from "../games/spy/classic/turns.js";
import type * as games_spy_classic_types_player from "../games/spy/classic/types/player.js";
import type * as games_spy_classic_types_wordPair from "../games/spy/classic/types/wordPair.js";
import type * as games_spy_classic_uiQueries from "../games/spy/classic/uiQueries.js";
import type * as games_spy_classic_utils_pairSelector from "../games/spy/classic/utils/pairSelector.js";
import type * as games_spy_classic_utils_roleAssigner from "../games/spy/classic/utils/roleAssigner.js";
import type * as games_spy_classic_utils_turnOrder from "../games/spy/classic/utils/turnOrder.js";
import type * as games_spy_classic_utils_winConditions from "../games/spy/classic/utils/winConditions.js";
import type * as games_spy_classic_words_animals from "../games/spy/classic/words/animals.js";
import type * as games_spy_classic_words_city from "../games/spy/classic/words/city.js";
import type * as games_spy_classic_words_entertainment from "../games/spy/classic/words/entertainment.js";
import type * as games_spy_classic_words_everyday from "../games/spy/classic/words/everyday.js";
import type * as games_spy_classic_words_food from "../games/spy/classic/words/food.js";
import type * as games_spy_classic_words_index from "../games/spy/classic/words/index.js";
import type * as games_spy_classic_words_movies from "../games/spy/classic/words/movies.js";
import type * as games_spy_classic_words_names from "../games/spy/classic/words/names.js";
import type * as games_spy_classic_words_nature from "../games/spy/classic/words/nature.js";
import type * as games_spy_classic_words_objects from "../games/spy/classic/words/objects.js";
import type * as games_spy_classic_words_places from "../games/spy/classic/words/places.js";
import type * as games_spy_classic_words_professions from "../games/spy/classic/words/professions.js";
import type * as games_spy_classic_words_sports from "../games/spy/classic/words/sports.js";
import type * as games_spy_classic_words_technology from "../games/spy/classic/words/technology.js";
import type * as games_spy_players from "../games/spy/players.js";
import type * as games_spy_rooms from "../games/spy/rooms.js";
import type * as http from "../http.js";
import type * as messages_index from "../messages/index.js";
import type * as notes_index from "../notes/index.js";
import type * as notes_notes from "../notes/notes.js";
import type * as notifications from "../notifications.js";
import type * as posts_index from "../posts/index.js";
import type * as security from "../security.js";
import type * as social_index from "../social/index.js";
import type * as users_index from "../users/index.js";
import type * as users_webhook from "../users/webhook.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/admin": typeof admin_admin;
  "admin/getUsersWithRanks": typeof admin_getUsersWithRanks;
  bookmarks: typeof bookmarks;
  collections: typeof collections;
  comments: typeof comments;
  "conversations/index": typeof conversations_index;
  files: typeof files;
  "games/spy/categories": typeof games_spy_categories;
  "games/spy/classic/categories": typeof games_spy_classic_categories;
  "games/spy/classic/categorySelection": typeof games_spy_classic_categorySelection;
  "games/spy/classic/game": typeof games_spy_classic_game;
  "games/spy/classic/gameEnd": typeof games_spy_classic_gameEnd;
  "games/spy/classic/nextRound": typeof games_spy_classic_nextRound;
  "games/spy/classic/result": typeof games_spy_classic_result;
  "games/spy/classic/roundVoting": typeof games_spy_classic_roundVoting;
  "games/spy/classic/tieBreak": typeof games_spy_classic_tieBreak;
  "games/spy/classic/tieBreakVoting": typeof games_spy_classic_tieBreakVoting;
  "games/spy/classic/turns": typeof games_spy_classic_turns;
  "games/spy/classic/types/player": typeof games_spy_classic_types_player;
  "games/spy/classic/types/wordPair": typeof games_spy_classic_types_wordPair;
  "games/spy/classic/uiQueries": typeof games_spy_classic_uiQueries;
  "games/spy/classic/utils/pairSelector": typeof games_spy_classic_utils_pairSelector;
  "games/spy/classic/utils/roleAssigner": typeof games_spy_classic_utils_roleAssigner;
  "games/spy/classic/utils/turnOrder": typeof games_spy_classic_utils_turnOrder;
  "games/spy/classic/utils/winConditions": typeof games_spy_classic_utils_winConditions;
  "games/spy/classic/words/animals": typeof games_spy_classic_words_animals;
  "games/spy/classic/words/city": typeof games_spy_classic_words_city;
  "games/spy/classic/words/entertainment": typeof games_spy_classic_words_entertainment;
  "games/spy/classic/words/everyday": typeof games_spy_classic_words_everyday;
  "games/spy/classic/words/food": typeof games_spy_classic_words_food;
  "games/spy/classic/words/index": typeof games_spy_classic_words_index;
  "games/spy/classic/words/movies": typeof games_spy_classic_words_movies;
  "games/spy/classic/words/names": typeof games_spy_classic_words_names;
  "games/spy/classic/words/nature": typeof games_spy_classic_words_nature;
  "games/spy/classic/words/objects": typeof games_spy_classic_words_objects;
  "games/spy/classic/words/places": typeof games_spy_classic_words_places;
  "games/spy/classic/words/professions": typeof games_spy_classic_words_professions;
  "games/spy/classic/words/sports": typeof games_spy_classic_words_sports;
  "games/spy/classic/words/technology": typeof games_spy_classic_words_technology;
  "games/spy/players": typeof games_spy_players;
  "games/spy/rooms": typeof games_spy_rooms;
  http: typeof http;
  "messages/index": typeof messages_index;
  "notes/index": typeof notes_index;
  "notes/notes": typeof notes_notes;
  notifications: typeof notifications;
  "posts/index": typeof posts_index;
  security: typeof security;
  "social/index": typeof social_index;
  "users/index": typeof users_index;
  "users/webhook": typeof users_webhook;
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
