import React from "react";
import { Avatar, Button, Card } from "antd";
// import Axios from "axios";
// import useAxios from "axios-hooks";
import { axiosInstance, useAxios } from "api";
import { HeartOutlined, HeartTwoTone, UserOutlined } from "@ant-design/icons";
import "./Post.scss";
import CommentList from "./CommentList";
import { useAppContext } from "store";

function Post({ post, handleLike }) {
  const { 
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: `JWT ${jwtToken}` };
  
  const { id, author, caption, location, photo, tag_set, is_like } = post;
  const { username, name, avatar_url } = author;

  const [{ data: originPostList, loading, error }, refetch] = useAxios({
    url: `/api/posts/`,
    headers
  });  

  const handlePostDelete = async ({ id }) => {
    const apiUrl = `/api/posts/${id}/`;
    try {
      const response = await axiosInstance.delete(
        apiUrl,
        { headers },
      );
      console.log("response :", response);
      window.location.replace("/");
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div className="post">
      <Card 
        hoverable 
        cover={<img src={photo} alt={caption} />}
        actions={[
          is_like ? (
            <HeartTwoTone 
              twoToneColor="#eb2f96" 
              onClick={() => handleLike({ post, isLike: false })}
            />
          ) : (
            <HeartOutlined onClick={() => handleLike({ post, isLike: true })} />
          )
        ]}
      >

        <Button 
          style={{ marginBottom: ".5em", float: 'right'}}
          type="primary" 
          onClick={() => handlePostDelete({ id })} 
        > 
          게시물 삭제
        </Button>

        <Card.Meta 
          avatar={
            <Avatar 
              size="large" 
              icon={<img src={avatar_url} alt={username} />} 
            />
          } 
          title={location} 
          description={caption}
          style={{ marginBottom: "0.5em" }}
        />

        <CommentList post={post} />
      
      </Card>
      {/* <img src={photo} alt={caption} style={{ width: "100px" }} />
      {caption}, {location} */}
    </div>
  );
}

export default Post;