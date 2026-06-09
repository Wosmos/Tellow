/**
 * Seed script — creates test users, chats, and messages.
 *
 * Requirements:
 *   1. Add SUPABASE_SERVICE_ROLE_KEY to tellow-app/.env  (Supabase -> Settings -> API -> service_role)
 *   2. Run from tellow-app/:  node scripts/seed.js
 */

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
	console.error("Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
	{ firstName: "Alice",   lastName: "Harmon",  email: "alice@tellow.dev",   password: "Test1234!", phone: "+12025550101" },
	{ firstName: "Bob",     lastName: "Carter",  email: "bob@tellow.dev",     password: "Test1234!", phone: "+12025550102" },
	{ firstName: "Charlie", lastName: "Nguyen",  email: "charlie@tellow.dev", password: "Test1234!", phone: "+12025550103" },
	{ firstName: "Diana",   lastName: "Patel",   email: "diana@tellow.dev",   password: "Test1234!", phone: "+12025550104" },
	{ firstName: "Eve",     lastName: "Santos",  email: "eve@tellow.dev",     password: "Test1234!", phone: "+12025550105" },
	{ firstName: "Frank",   lastName: "Miller",  email: "frank@tellow.dev",   password: "Test1234!", phone: "+12025550106" },
];

async function createAuthUser(email, password) {
	const { data, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	});
	if (error) {
		if (error.message.includes("already been registered") || error.message.includes("already exists")) {
			const { data: list } = await supabase.auth.admin.listUsers();
			const existing = list?.users?.find((u) => u.email === email);
			return existing?.id;
		}
		throw error;
	}
	return data.user.id;
}

async function insertUserProfile(userId, user) {
	const firstLast = (user.firstName + " " + user.lastName).toLowerCase();
	const { error } = await supabase.from("users").upsert({
		user_id: userId,
		first_name: user.firstName,
		last_name: user.lastName,
		first_last: firstLast,
		email: user.email,
		phone_number: user.phone,
		about: "Hey there! I am " + user.firstName + ".",
	}, { onConflict: "user_id" });
	if (error) throw error;
}

async function createChat(creatorId, userIds, isGroup, chatName) {
	const { data, error } = await supabase.from("chats").insert({
		is_group_chat: isGroup,
		chat_name: chatName || "",
		chat_image: "",
		created_by: creatorId,
		updated_by: creatorId,
	}).select("chat_id").single();
	if (error) throw error;

	const chatId = data.chat_id;
	for (const uid of userIds) {
		const { error: cuErr } = await supabase.from("chat_users").upsert(
			{ user_id: uid, chat_id: chatId },
			{ onConflict: "user_id,chat_id" }
		);
		if (cuErr) console.warn("  chat_users upsert:", cuErr.message);
	}
	return chatId;
}

async function sendMessage(chatId, senderId, text) {
	const { error: msgErr } = await supabase.from("messages").insert({
		chat_id: chatId,
		sent_by: senderId,
		text,
		type: "text",
	});
	if (msgErr) throw msgErr;

	await supabase.from("chats").update({
		latest_message_text: text,
		updated_by: senderId,
		updated_at: new Date().toISOString(),
	}).eq("chat_id", chatId);
}

async function main() {
	console.log("Seeding Tellow test data...\n");

	// 1. Create auth users + profiles
	const userIds = {};
	for (const u of TEST_USERS) {
		process.stdout.write("  Creating " + u.firstName + " " + u.lastName + "... ");
		try {
			const uid = await createAuthUser(u.email, u.password);
			await insertUserProfile(uid, u);
			userIds[u.email] = uid;
			console.log("OK (" + uid.slice(0, 8) + ")");
		} catch (e) {
			console.log("FAILED: " + e.message);
		}
	}

	const ids = TEST_USERS.map((u) => userIds[u.email]);
	const [alice, bob, charlie, diana, eve, frank] = ids;

	if (!alice || !bob) {
		console.error("\nCould not create core users. Aborting.");
		process.exit(1);
	}

	// 2. DM chats
	console.log("\n  Creating DM chats...");

	const chat1 = await createChat(alice, [alice, bob], false, null);
	await sendMessage(chat1, alice, "Hey Bob! How are you doing?");
	await sendMessage(chat1, bob,   "Alice! All good here, just got back from the gym");
	await sendMessage(chat1, alice, "Nice! We should catch up soon");
	await sendMessage(chat1, bob,   "Absolutely, free this weekend?");
	console.log("  OK Alice <-> Bob (" + chat1.slice(0, 8) + ")");

	const chat2 = await createChat(alice, [alice, charlie], false, null);
	await sendMessage(chat2, charlie, "Alice did you see the new design mockups?");
	await sendMessage(chat2, alice,   "Not yet! Send them over");
	await sendMessage(chat2, charlie, "On it, give me 5 mins");
	console.log("  OK Alice <-> Charlie (" + chat2.slice(0, 8) + ")");

	const chat3 = await createChat(bob, [bob, diana], false, null);
	await sendMessage(chat3, bob,   "Diana, are you joining the standup?");
	await sendMessage(chat3, diana, "Yes! Be there in 2");
	console.log("  OK Bob <-> Diana (" + chat3.slice(0, 8) + ")");

	// 3. Group chats
	console.log("\n  Creating group chats...");

	const groupIds = ids.filter(Boolean);
	const group1 = await createChat(alice, groupIds, true, "Team Tellow");
	await sendMessage(group1, alice,   "Welcome everyone to the team chat!");
	await sendMessage(group1, bob,     "Excited to be here!");
	await sendMessage(group1, charlie, "Same! Lets build something great");
	await sendMessage(group1, diana,   "Hello team!");
	if (eve)   await sendMessage(group1, eve,   "Hi everyone!");
	if (frank) await sendMessage(group1, frank, "Ready to get to work");
	await sendMessage(group1, alice,   "First sprint planning is tomorrow at 10am");
	console.log("  OK Team Tellow (" + group1.slice(0, 8) + ")");

	const group2Members = [alice, bob, charlie, diana].filter(Boolean);
	const group2 = await createChat(charlie, group2Members, true, "Design Review");
	await sendMessage(group2, charlie, "Sharing the new mockups here for feedback");
	await sendMessage(group2, diana,   "Love the color palette!");
	await sendMessage(group2, alice,   "The nav structure looks clean, good work Charlie");
	await sendMessage(group2, bob,     "One suggestion: increase the font size on mobile views");
	console.log("  OK Design Review (" + group2.slice(0, 8) + ")");

	// 4. Contacts
	console.log("\n  Adding contacts...");
	const pairs = [[alice, bob], [alice, charlie], [bob, diana], [charlie, eve]].filter(([a, b]) => a && b);
	for (const [uid, cid] of pairs) {
		await supabase.from("contacts").upsert({ user_id: uid, contact_user_id: cid }, { onConflict: "user_id,contact_user_id" });
		await supabase.from("contacts").upsert({ user_id: cid, contact_user_id: uid }, { onConflict: "user_id,contact_user_id" });
	}
	console.log("  OK mutual contacts added");

	console.log("\nDone! Test accounts (password: Test1234!):");
	for (const u of TEST_USERS) {
		const uid = userIds[u.email];
		console.log("  " + u.email + (uid ? "  (" + uid.slice(0, 8) + ")" : "  (failed)"));
	}
	console.log("");
}

main().catch((e) => { console.error(e); process.exit(1); });
