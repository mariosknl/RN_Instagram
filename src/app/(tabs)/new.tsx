import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "~/src/components/Button";

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
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
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
				<Button title="Share" onPress={() => {}} />
			</View>
		</View>
	);
}
