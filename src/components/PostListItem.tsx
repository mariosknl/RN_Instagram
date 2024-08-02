import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Text, useWindowDimensions, View } from "react-native";

import { AdvancedImage, AdvancedVideo } from "cloudinary-react-native";

// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { cld } from "~/src/lib/cloudinary";
import PostContent from "./PostContent";

export default function PostListItem({ post }) {
	const { width } = useWindowDimensions();

	const image = cld.image(post.image);
	image.resize(thumbnail().width(width).height(width));

	const avatar = cld.image(post.user.avatar_url || "user_is3jme");
	avatar.resize(
		thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
	);

	const video = cld.video(post.image);
	return (
		<View className="bg-white">
			{/* Header */}
			<View className="p-3 flex-row items-center gap-2">
				<AdvancedImage
					cldImg={avatar}
					className="w-12 aspect-square rounded-full"
				/>
				<Text className="font-semibold">
					{post.user.username || "New User"}
				</Text>
			</View>

			{/* Content */}
			<PostContent post={post} />

			{/* Icons */}
			<View className="flex-row gap-3 p-3">
				<AntDesign name="hearto" size={20} />
				<Ionicons name="chatbubble-outline" size={20} />
				<Feather name="send" size={20} />

				<Feather name="bookmark" size={20} className="ml-auto" />
			</View>
		</View>
	);
}
