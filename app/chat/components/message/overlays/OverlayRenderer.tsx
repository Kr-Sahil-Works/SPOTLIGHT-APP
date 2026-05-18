import React from "react";

import { Id } from "@/convex/_generated/dataModel";

import MessageMenu from "./MessageMenu";

import ReactionPicker from "./ReactionPicker";

import DeleteDialog from "./DeleteDialog";

import { useOverlay } from "../hooks";

type Props = {
  currentUserId?: string;

  onReply: (msg: any) => void;

  onDelete: (msg: any) => void;

  onCopy: (msg: any) => void;

  onEdit?: (msg: any) => void;

  toggleReaction: (data: {
    messageId: Id<"messages">;
    reaction: string;
  }) => Promise<any> | void;
};

export default function OverlayRenderer({
  currentUserId,

  onReply,

  onDelete,

  onCopy,

  onEdit,

  toggleReaction,
}: Props) {
  const {
  overlay,
  openMenu,
} = useOverlay();
  return (
    <>
      <MessageMenu
        currentUserId={
          currentUserId
        }
        onReply={onReply}
        onDelete={onDelete}
        onCopy={onCopy}
        onEdit={onEdit}
      />

      <ReactionPicker
  toggleReaction={
    toggleReaction
  }
  onMore={() => {
    if (
      overlay.message
    ) {
      openMenu(
        overlay.message
      );
    }
  }}
/>

      <DeleteDialog
        onDelete={onDelete}
      />
    </>
  );
}