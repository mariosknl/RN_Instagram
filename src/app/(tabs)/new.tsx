import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import Button from "~/src/components/Button";
import { uploadImage } from "~/src/lib/cloudinary";

export default function CreatePost() {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState<string | null>(null);

	useEffect(() => {
		if (!image) {
			pickImage();
		}
	}, [image]);

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.5,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const createPost = async () => {
		if (!image) {
			return;
		}
		const response = await uploadImage(image);
		// save the post in db
		console.log("response", response?.public_id);
	};

	return (
		<View className="p-3 items-center flex-1">
			{/* Image Picker */}
			{image ? (
				<Image
					source={{ uri: image }}
					className="w-52 aspect-[3/4] rounded-lg"
				/>
			) : (
				<View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
			)}

			<Text onPress={pickImage} className="text-blue-500 font-semibold m-5">
				Change
			</Text>

			{/* TextInput - Caption */}
			<TextInput
				placeholder="Write a caption..."
				className="w-full p-3"
				value={caption}
				onChangeText={(newValue) => setCaption(newValue)}
			/>

			{/* Button */}
			<View className="mt-auto w-full">
				<Button title="Share" onPress={createPost} />
			</View>
		</View>
	);
}
