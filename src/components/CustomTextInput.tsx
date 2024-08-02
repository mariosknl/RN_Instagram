import { Text, TextInput } from "react-native";

export default function CustomTextInput({ label, ...textInputProps }: any) {
	return (
		<>
			<Text className="mb-2 text-gray-500 font-semibold">{label}</Text>
			<TextInput
				{...textInputProps}
				className="border border-gray-300 p-3 rounded-md"
			/>
		</>
	);
}
