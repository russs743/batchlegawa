"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export async function createCommentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        target VARCHAR(255) NOT NULL,
        x FLOAT DEFAULT 50,
        y FLOAT DEFAULT 50,
        color VARCHAR(50) DEFAULT 'yellow',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // We also run ALTER TABLE just in case the table already exists from the previous step
    // so we don't have to manually drop it. In a real production app we'd use migrations.
    try {
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS x FLOAT DEFAULT 50;`;
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS y FLOAT DEFAULT 50;`;
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'yellow';`;
    } catch (e) {
      console.log("Columns might already exist", e);
    }

    console.log("Table 'comments' configured successfully.");
    return { success: true };
  } catch (error) {
    console.error("Error creating comments table:", error);
    return { error: "Failed to create table" };
  }
}

export async function addComment(formData: FormData) {
  try {
    const name = formData.get("name")?.toString();
    const message = formData.get("message")?.toString();
    const target = formData.get("target")?.toString();
    const x = parseFloat(formData.get("x")?.toString() || "50");
    const y = parseFloat(formData.get("y")?.toString() || "50");
    const color = formData.get("color")?.toString() || "yellow";

    if (!name || !message || !target) {
      throw new Error("Missing required fields");
    }

    try {
      await sql`
        INSERT INTO comments (name, message, target, x, y, color)
        VALUES (${name}, ${message}, ${target}, ${x}, ${y}, ${color})
      `;
    } catch (insertError: any) {
      // If the error is missing column (because the table existed before we added x, y, color)
      console.log("Insert failed, trying to alter table...", insertError.message);
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS x FLOAT DEFAULT 50;`;
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS y FLOAT DEFAULT 50;`;
      await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'yellow';`;
      
      // Retry insert
      await sql`
        INSERT INTO comments (name, message, target, x, y, color)
        VALUES (${name}, ${message}, ${target}, ${x}, ${y}, ${color})
      `;
    }

    // Revalidate the home page to show the new comment
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}

export async function updateCommentPosition(id: number, x: number, y: number) {
  try {
    await sql`
      UPDATE comments 
      SET x = ${x}, y = ${y}
      WHERE id = ${id}
    `;
    
    // NOT revalidating path here to prevent visual jumps on the client!
    return { success: true };
  } catch (error) {
    console.error("Error updating comment position:", error);
    return { error: "Failed to update position" };
  }
}

export async function getComments() {
  try {
    // Fetch comments ordered by newest first
    const { rows } = await sql`SELECT * FROM comments ORDER BY created_at DESC LIMIT 100`;
    return rows;
  } catch (error: any) {
    // If the error is that the relation doesn't exist, it means the table hasn't been created yet.
    if (error.message && error.message.includes('relation "comments" does not exist')) {
      console.log("Comments table not found, creating it automatically...");
      await createCommentsTable();
      return []; // Return empty array since table was just created
    }
    console.error("Error fetching comments:", error);
    return [];
  }
}
