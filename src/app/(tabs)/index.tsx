import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		let { data, error } = await supabase
			.from("posts")
			.select("*, user:profiles(*)");

		if (error) {
			Alert.alert("something went wrong");
		}
		setPosts(data);
	};

	console.log("posts", posts);
	return (
		<FlatList
			data={posts}
			renderItem={({ item }) => <PostListItem post={item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{
				gap: 10,
				maxWidth: 512,
				width: "100%",
				alignSelf: "center",
			}}
			showsVerticalScrollIndicator={false}
		/>
	);
}
