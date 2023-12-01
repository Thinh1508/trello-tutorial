"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export type State = {
  errors?: {
    title?: string[]
  }
  message?: string | null
}

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Minimum length of 3 letters is required",
  }),
})

export async function createBoard(prevState: State, formData: FormData) {
  const validateFields = CreateBoard.safeParse({
    title: formData.get("title"),
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing fields.",
    }
  }

  const { title } = validateFields.data

  try {
    await db.board.create({
      data: {
        title,
      },
    })
  } catch (error) {
    return {
      message: "Database Error",
    }
  }

  revalidatePath("/organization/org_2Yq6t7wvC1w2hMWUWPo6BYOr23R")
  redirect("/organization/org_2Yq6t7wvC1w2hMWUWPo6BYOr23R")
}
