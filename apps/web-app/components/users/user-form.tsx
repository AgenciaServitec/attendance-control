"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Field, FieldContent, FieldError, FieldLabel, FieldTitle} from "@/components/ui/field";
import {isFieldRequired} from "@/lib/zod-utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Building2, Loader2, UserPlus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CountryCodes from "../../data-list/countries.json";
import {getDataByDni} from "@/app/actions/profiles-actions";

export function UserForm({user, onSubmit, schema, isNew}) {

    const [isSearching, setIsSearching] = useState(false);

    const { handleSubmit, control, reset, getValues, setValue, watch } = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    const documentType = watch("documentType");
    const documentNumber = watch("documentNumber");

    useEffect(() => {
        reset({
            ruc: user?.ruc || "",
            invitationCode: user?.invitation_code || "",
            businessName: user?.business_name || "",
            address: user?.address || "",
            firstName: user?.first_name || "",
            paternalSurname: user?.paternal_surname || "",
            maternalSurname: user?.maternal_surname || "",
            documentType: user?.document_type || "dni",
            documentNumber: user?.document_number || "",
            status: user?.status || "active",
            countryCode: user?.country_code || "+51",
            phoneNumber: user?.phone_number || "",
            email: user?.email || "",
            registrationMethod: user?.registration_method || "create",
        });
    }, [user, reset]);

    const handleSearchDni = async () => {
        const docNum = getValues("documentNumber");
        const docType = getValues("documentType");

        if (docType !== "dni" || !docNum || docNum.length !== 8) return;

        setIsSearching(true);
        const data = await getDataByDni(docNum);
        setIsSearching(false);

        if (data) {
            setValue("firstName", data.firstName.toLowerCase(), { shouldValidate: true });
            setValue("paternalSurname", data.paternalSurname.toLowerCase(), { shouldValidate: true });
            setValue("maternalSurname", data.maternalSurname.toLowerCase(), { shouldValidate: true });
        }
    };

    return <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-6 gap-4">
        <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6">
                    <FieldLabel htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, "status")}>
                        Estado
                    </FieldLabel>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                        >
                            <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                            <SelectItem value="suspended">Suspendido</SelectItem>
                        </SelectContent>
                    </Select>
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="documentType"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6 lg:col-span-1">
                    <FieldLabel htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, field.name)}>
                        Tipo de Documento
                    </FieldLabel>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                        >
                            <SelectValue placeholder="DNI/CE/PASAPORTE" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dni">DNI</SelectItem>
                            <SelectItem value="ce">CE</SelectItem>
                            <SelectItem value="passport">Pasaporte</SelectItem>
                        </SelectContent>
                    </Select>

                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="documentNumber"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6 lg:col-span-5">
                    <FieldLabel htmlFor={field.name} className="text-xs font-semibold" required={isFieldRequired(schema, field.name)}>
                        Número de Documento
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput {...field} id={field.name} aria-invalid={fieldState?.invalid} placeholder="Ej. 71234567" />
                        {
                            isNew && <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    type="button"
                                    variant="secondary"
                                    onClick={handleSearchDni}
                                >
                                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                                </InputGroupButton>
                            </InputGroupAddon>
                        }
                    </InputGroup>
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6">
                    <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-semibold"
                        required={isFieldRequired(schema, "firstName")}
                    >
                        Nombres
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState?.invalid}
                        placeholder="Ej. Juan Carlos"
                        disabled={!isNew}
                    />
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="paternalSurname"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6">
                    <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-semibold"
                        required={isFieldRequired(schema, "paternalSurname")}
                    >
                        Apellido Paterno
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState?.invalid}
                        placeholder="Ej. Pérez"
                        disabled={!isNew}
                    />
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="maternalSurname"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6">
                    <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-semibold"
                        required={isFieldRequired(schema, "maternalSurname")}
                    >
                        Apellido Materno
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState?.invalid}
                        placeholder="Ej. Gómez"
                        disabled={!isNew}
                    />
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="countryCode"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6 lg:col-span-1">
                    <FieldLabel htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, field.name)}>
                        Código de País
                    </FieldLabel>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                        >
                            <SelectValue placeholder="Código de País" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                CountryCodes.map(country => (
                                    <SelectItem key={country.code} value={country.dial_code}>
                                        {country.code} {country.dial_code}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="phoneNumber"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6 lg:col-span-5">
                    <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-semibold"
                        required={isFieldRequired(schema, "phoneNumber")}
                    >
                        Número de Celular
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState?.invalid}
                        placeholder="Ej. 20123456789"
                    />
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState?.invalid} className="col-span-6">
                    <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-semibold"
                        required={isFieldRequired(schema, "email")}
                    >
                        Correo Electrónico
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState?.invalid}
                        placeholder="juan.perez@ejemplo.com"
                    />
                    {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
        {
            isNew && <>
                <Controller
                    name="registrationMethod"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState?.invalid} className="col-span-6">
                            <FieldLabel htmlFor={field.name} className="text-xs font-semibold" required={isFieldRequired(schema, "email")}>Modo de registro</FieldLabel>
                            <RadioGroup
                                name={field.name}
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                            >
                                <FieldLabel key="create" htmlFor="create">
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle><Building2 size={18}/><span>Crear Organización</span></FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem
                                            value="create"
                                            id="create"
                                            aria-invalid={fieldState.invalid}
                                        />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel key="join" htmlFor="join">
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldTitle><UserPlus size={18}/><span>Unirme a Organización</span></FieldTitle>
                                        </FieldContent>
                                        <RadioGroupItem
                                            value="join"
                                            id="join"
                                            aria-invalid={fieldState.invalid}
                                        />
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="ruc"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState?.invalid} className="col-span-6">
                            <FieldLabel
                                htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, field.name)}
                            >
                                RUC
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput {...field}
                                                 id={field.name}
                                                 aria-invalid={fieldState?.invalid}
                                                 placeholder="Ej. 20123456789" />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton variant="secondary">Buscar</InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="businessName"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState?.invalid} className="col-span-6">
                            <FieldLabel
                                htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, field.name)}
                            >
                                Razón Social
                            </FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState?.invalid}
                                placeholder="Ej. 20123456789"
                            />
                            {fieldState?.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="invitationCode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState?.invalid} className="col-span-6">
                            <FieldLabel
                                htmlFor={field.name}
                                className="text-xs font-semibold"
                                required={isFieldRequired(schema, field.name)}
                            >
                                Código de Invitación
                            </FieldLabel>
                            <Input
                                {...field}
                                id="invitationCode"
                                aria-invalid={fieldState?.invalid}
                                placeholder="Ej. INV-123456"
                                onChange={(e) =>
                                    field.onChange(e.target.value.toUpperCase())
                                }
                            />
                            {fieldState?.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </>
        }
        <div className="col-span-6">
            <div className="flex flex-col lg:flex-row justify-end gap-4">
                <Button className="px-8">Guardar</Button>
                <Button variant="outline" className="px-8">Cancelar</Button>
            </div>
        </div>
    </form>
}