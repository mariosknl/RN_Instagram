import { Alert, Image, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import Button from "~/src/components/Button";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import CustomTextInput from "~/src/components/CustomTextInput";
import { cld, uploadImage } from "~/src/lib/cloudinary";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "cloudinary-react-native";

export default function ProfileScreen() {
	const [image, setImage] = useState<string | null>(null);
	const [remoteImage, setRemoteImage] = useState<string | null>(null);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");

	const { user } = useAuth();

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = async () => {
		if (!user) {
			return;
		}

		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) {
			Alert.alert("Failed to fetch profile");
		}

		setUsername(data.username);
		setBio(data.bio);
		setRemoteImage(data.avatar_url);
	};

	const updateProfile = async () => {
		if (!user) {
			return;
		}

		const updatedProfile = {
			id: user.id,
			username,
			bio,
		};

		if (image) {
			const response = await uploadImage(image);

			updatedProfile.avatar_url = response?.public_id;
		}

		const { data, error } = await supabase
			.from("profiles")
			.update(updatedProfile)
			.eq("id", user.id)
			.select("*");

		console.log("data", data);
		console.log("error", error);

		if (error) {
			Alert.alert("Failed to update profile");
		}
	};

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	let remoteCldImage;
	if (remoteImage) {
		remoteCldImage = cld.image(remoteImage);
		remoteCldImage.resize(thumbnail().width(300).height(300));
	}

	return (
		<View className="p-3 flex-1">
			{/* Avatar Image Picker */}
			{image ? (
				<Image
					source={{ uri: image }}
					className="w-52 aspect-square self-center rounded-full"
				/>
			) : remoteCldImage ? (
				<AdvancedImage
					cldImg={remoteCldImage}
					className="w-52 aspect-square self-center rounded-full"
				/>
			) : (
				<View className="w-52 aspect-square self-center rounded-full bg-slate-300" />
			)}
			<Text
				onPress={pickImage}
				className="text-blue-500 font-semibold m-5 self-center"
			>
				Change
			</Text>

			{/* Form  */}
			<View className="gap-5">
				<CustomTextInput
					placeholder="Username"
					label="Username"
					value={username}
					onChangeText={setUsername}
				/>

				<CustomTextInput
					placeholder="Bio"
					label="Bio"
					value={bio}
					onChangeText={setBio}
					multiline
					numberOfLines={3}
				/>
			</View>

			{/* Buttons */}
			<View className="mt-auto gap-2">
				<Button title="Update profile" onPress={updateProfile} />
				<Button title="Sign out" onPress={() => supabase.auth.signOut()} />
			</View>
		</View>
	);
}
