import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import moment from "moment";
import client from "../../services/restClient";

const CommentsSection = ({ recordId, user, alert }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch company comments
    const fetchComments = async () => {
      try {
        const res = await client.service("comments").find({
          query: {
            recordId,
            $populate: "createdBy",
          },
        });
        setComments(res.data || []);
      } catch (error) {
        console.log({ error });
        alert({
          title: "Comments",
          type: "error",
          message: error.message || "Failed to get comments",
        });
      }
    };

    fetchComments();
  }, [recordId, alert]);

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const comment = await client.service("comments").create({
          text: newComment,
          recordId,
          createdBy: user._id,
          updatedBy: user._id,
        });

        const newCommentWithUser = {
          ...comment,
          createdBy: {
            _id: user._id,
            name: user.email,
          },
        };

        setComments([...comments, newCommentWithUser]);
        setNewComment("");
      } catch (error) {
        console.log({ error });
        alert({
          title: "Comment",
          type: "error",
          message: error.message || "Failed to add comment",
        });
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await client.service("comments").remove(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      alert({
        title: "Comment",
        type: "success",
        message: "Comment deleted successfully!",
      });
    } catch (error) {
      console.log({ error });
      alert({
        title: "Comment",
        type: "error",
        message: error.message || "Failed to delete comment",
      });
    }
  };

  return (
    <div className="card w-full">
      <h4 className="mb-4">Comments</h4>

      <div className="comment-section">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="comment-card mb-3 p-3 border-round surface-border"
            >
              <div className="flex align-items-center justify-content-between mb-2">
                <div className="flex align-items-center">
                  <div className="comment-avatar flex-shrink-0">
                    <i className="pi pi-user text-2xl"></i>
                  </div>

                  <div className="ml-3">
                    <strong className="text-primary">
                      {comment.createdBy.name}
                    </strong>
                    <small className="ml-2 text-secondary">
                      {moment(comment.createdAt).fromNow()}
                    </small>
                  </div>
                </div>

                <Button
                  icon="pi pi-trash"
                  className="p-button-text p-button-danger p-0"
                  onClick={() => handleDeleteComment(comment._id)}
                  tooltip="Delete comment"
                  tooltipOptions={{ position: "top" }}
                />
              </div>

              <p className="m-0 text-sm">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      <div className="comment-input-section mt-4 p-3 border-top-1 surface-border">
        <div className="flex align-items-center">
          <div className="comment-avatar flex-shrink-0">
            <i className="pi pi-user text-2xl"></i>
          </div>

          <div className="ml-3 w-full">
            <InputText
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-inputtext-lg"
            />
          </div>

          <Button
            label="Submit"
            onClick={handleCommentSubmit}
            className="ml-3 p-button-rounded p-button-primary"
            disabled={!newComment.trim()} // Disable if input is empty
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
