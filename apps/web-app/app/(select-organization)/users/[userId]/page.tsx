"use client";

import {useEffect, useState, useTransition} from "react";
import {useParams, useRouter} from "next/navigation";
import {getProfile} from "@/app/actions/profiles-actions";
import {z} from "zod";
import {UserForm} from "@/components/users/user-form";

const schema = z.object({
  firstName: z.string().min(1, "Campo obligatorio"),
  paternalSurname: z.string().min(1, "Campo obligatorio"),
  maternalSurname: z.string().min(1, "Campo obligatorio"),
  documentType: z.string().min(1, "Campo obligatorio"),
  documentNumber: z.string().min(1, "Campo obligatorio"),
  status: z.string().min(1, "Campo obligatorio"),
  countryCode: z.string().min(1, "Campo obligatorio"),
  phoneNumber: z.string().min(1, "Campo obligatorio"),
  email: z.string().min(1, "Campo obligatorio"),
  registrationMethod: z.string().min(1, "Campo obligatorio"),
  businessName: z.string().min(1, "Campo obligatorio"),
  ruc: z.string().min(1, "Campo obligatorio"),
  invitationCode: z.string().min(1, "Campo obligatorio"),
})

export default function UserPage() {

  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState({});
  const [isPending, startTransition] = useTransition();

  const isNew = userId === "create";

  useEffect(() => {
    if (isNew) return;

    startTransition(async () => {
      const _user = await getProfile(userId as string);
      if (_user?.data) {
        setUser(_user.data);
      }
    });
  }, [userId, isNew]);

  const onSubmit = (formData) => {
    try {
      console.log(formData);
    }catch (e) {
      console.error(e)
    }
  }

  return <div className="space-y-4">
    <UserForm user={user} onSubmit={onSubmit} schema={schema} isNew={isNew} />
  </div>
}
