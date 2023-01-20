import React, { useEffect, useState } from "react";
import { Alert } from "antd";
// import Axios from "axios";
// import useAxios from 'axios-hooks';
import { useAxios, axiosInstance } from "api";
import Post from "./Post";
import { useAppContext } from "store";

function PostList() {
  const { 
    store: { jwtToken }, 
  } = useAppContext();

  const [postList, setPostList] = useState([]);
  
  const headers = { Authorization: `JWT ${jwtToken}` };

  const [{ data: originPostList, loading, error }, refetch] = useAxios({
    url: "/api/posts/",
    headers,
  });

  // FIXME: 새 포스팅을 저장 후, 포스팅 목록 컴포넌트 화면으로 이동을 했을 때, 방금 저장한 포스팅이 보이지 않는다. 
  // refetch() 사용하니, uncaught (in promise) AxiosError 에러가 남. 이후 해결해보자.

  useEffect(() => {
    setPostList(originPostList);
  }, [originPostList]);

  const handleLike = async ({ post, isLike }) => {
    const apiUrl = `/api/posts/${post.id}/like/`;
    const method = isLike ? "POST" : "DELETE";

    try {
      const response = await axiosInstance({
        url: apiUrl,
        method,
        headers,
      });
      console.log("response :", response);
      setPostList(prevList => {
        return prevList.map(currentPost =>
          currentPost === post 
            ? { ...currentPost, is_like: isLike } 
            : currentPost
        );
      });
    } catch(error) {
      console.log("error :", error);
    };
  };

  return (
    <div>
      {postList && postList.length === 0 && (
        <Alert type="warning" message="포스팅이 없습니다. :-(" />
      )}
      {postList &&
        postList.map(post => (
          <Post post={post} key={post.id} handleLike={handleLike} />
        ))}
    </div>
  );
}

export default PostList;