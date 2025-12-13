import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Países de Europa y América con códigos ISO 3166-1 alpha-2
export const COUNTRIES = {
    // América
    AR: "Argentina",
    BO: "Bolivia",
    BR: "Brasil",
    CA: "Canadá",
    CL: "Chile",
    CO: "Colombia",
    CR: "Costa Rica",
    CU: "Cuba",
    DO: "República Dominicana",
    EC: "Ecuador",
    SV: "El Salvador",
    GT: "Guatemala",
    HN: "Honduras",
    MX: "México",
    NI: "Nicaragua",
    PA: "Panamá",
    PY: "Paraguay",
    PE: "Perú",
    PR: "Puerto Rico",
    UY: "Uruguay",
    US: "Estados Unidos",
    VE: "Venezuela",

    // Europa
    AL: "Albania",
    AD: "Andorra",
    AT: "Austria",
    BY: "Bielorrusia",
    BE: "Bélgica",
    BA: "Bosnia y Herzegovina",
    BG: "Bulgaria",
    HR: "Croacia",
    CY: "Chipre",
    CZ: "República Checa",
    DK: "Dinamarca",
    EE: "Estonia",
    FI: "Finlandia",
    FR: "Francia",
    DE: "Alemania",
    GR: "Grecia",
    HU: "Hungría",
    IS: "Islandia",
    IE: "Irlanda",
    IT: "Italia",
    XK: "Kosovo",
    LV: "Letonia",
    LI: "Liechtenstein",
    LT: "Lituania",
    LU: "Luxemburgo",
    MT: "Malta",
    MD: "Moldavia",
    MC: "Mónaco",
    ME: "Montenegro",
    NL: "Países Bajos",
    MK: "Macedonia del Norte",
    NO: "Noruega",
    PL: "Polonia",
    PT: "Portugal",
    RO: "Rumania",
    RU: "Rusia",
    SM: "San Marino",
    RS: "Serbia",
    SK: "Eslovaquia",
    SI: "Eslovenia",
    ES: "España",
    SE: "Suecia",
    CH: "Suiza",
    UA: "Ucrania",
    GB: "Reino Unido",
    VA: "Ciudad del Vaticano",
} as const

export type CountryCode = keyof typeof COUNTRIES

interface CountrySelectProps {
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    disabled?: boolean
    className?: string
}

export function CountrySelect({
    value,
    onValueChange,
    placeholder = "Selecciona un país",
    searchPlaceholder = "Buscar país...",
    emptyMessage = "No se encontró ningún país.",
    disabled = false,
    className,
}: CountrySelectProps) {
    const [open, setOpen] = React.useState(false)

    // Ordenar países alfabéticamente por nombre
    const sortedCountries = React.useMemo(
        () => Object.entries(COUNTRIES).sort((a, b) =>
            a[1].localeCompare(b[1], 'es')
        ),
        []
    )

    // Obtener el nombre del país seleccionado
    const selectedCountryName = value ? COUNTRIES[value as CountryCode] : null

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between text-sm",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    {selectedCountryName || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {sortedCountries.map(([code, name]) => (
                                <CommandItem
                                    key={code}
                                    value={name}
                                    onSelect={() => {
                                        onValueChange?.(code === value ? "" : code)
                                        setOpen(false)
                                    }}
                                >
                                    {name}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
