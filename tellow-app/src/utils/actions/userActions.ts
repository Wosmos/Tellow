import { supabase } from "../supabase";

export const searchUsers = async (queryText: string) => {
	const searchTerm = queryText.toLowerCase();

	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.ilike("first_last", `${searchTerm}%`);

		if (error) throw error;

		const result: Record<string, any> = {};
		data?.forEach((row) => {
			result[row.user_id] = {
				userId: row.user_id,
				firstName: row.first_name,
				lastName: row.last_name,
				firstLast: row.first_last,
				email: row.email,
				about: row.about || "",
				profilePicture: row.profile_picture || "",
				signUpDate: row.sign_up_date,
			};
		});

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
