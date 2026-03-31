import { supabase } from "../supabase";

type SetUserStausParams = {
	userId: string;
	status: string;
};

export const setUserStatus = async (data: SetUserStausParams) => {
	const { userId, status } = data;
	try {
		await supabase.from("user_statuses").insert({
			user_id: userId,
			image_url: status,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getUserStatuses = async (userId: string) => {
	try {
		const { data, error } = await supabase
			.from("user_statuses")
			.select("*, status_views(*)")
			.eq("user_id", userId)
			.order("created_at", { ascending: true });

		if (error) throw error;

		// Convert to the format the app expects
		const statuses: Record<string, any> = {};
		data?.forEach((row) => {
			const views: Record<string, any> = {};
			row.status_views?.forEach((view: any, i: number) => {
				views[i.toString()] = {
					viewerId: view.viewer_id,
					viewedAt: view.viewed_at,
				};
			});

			statuses[row.status_id] = {
				imageUrl: row.image_url,
				createdAt: row.created_at,
				views,
			};
		});

		return statuses;
	} catch (error) {
		console.log(error);
	}
};

type DeleteUserStatusParams = {
	userId: string;
	statusId: string;
};

export const deleteUserStatus = async (data: DeleteUserStatusParams) => {
	const { statusId } = data;

	try {
		await supabase.from("user_statuses").delete().eq("status_id", statusId);
	} catch (error) {
		console.log(error);
	}
};

type UpdateUserStatusViewsParams = {
	userId: string;
	statusId: string;
	viewerId: string;
};

export const updateStatusViews = async (data: UpdateUserStatusViewsParams) => {
	const { viewerId, statusId } = data;

	try {
		await supabase.from("status_views").insert({
			status_id: statusId,
			viewer_id: viewerId,
		});
	} catch (error) {
		console.log(error);
	}
};
