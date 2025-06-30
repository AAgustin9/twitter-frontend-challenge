import React from "react";
import { useParams } from "react-router-dom";
import Feed from "./Feed";
import { useProfilePosts } from "../../hooks/queries/useProfilePosts";

const ProfileFeed = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading, isError } = useProfilePosts(id!);

  if (isLoading) return <Feed posts={[]} loading={true} />;
  if (isError) return <div>Error loading profile posts.</div>;

  return <Feed posts={posts ?? []} loading={false} />;
};

export default ProfileFeed;
