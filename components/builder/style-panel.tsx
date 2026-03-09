"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    ChevronDown,
    Info,
    X,
    Plus,
    Copy,
    Trash2
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface StylePanelProps {
    data: any
    onChange: (path: string, value: any) => void
    selectedElement?: string | null
    onClose?: () => void
}

export function StylePanel({ data, onChange, selectedElement, onClose }: StylePanelProps) {
    const [activeAlign, setActiveAlign] = useState<"left" | "center" | "right" | "justify">("left")
    const [format, setFormat] = useState({ bold: false, italic: false, underline: false, strike: false })
    const { toast } = useToast()

    const notReady = (title: string) => {
        toast({
            title,
            description: "This control is ready for wiring to element styling. Functionality coming next.",
        })
    }

    return (
        <aside className="w-[300px] border-l bg-white flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
            {onClose && <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 lg:hidden" onClick={onClose}><X className="size-4"/></Button>}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">



                {/* Align Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Align</h3>
                    <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
                        {(["left", "center", "right", "justify"] as const).map((align) => (
                            <Button
                                key={align}
                                variant="ghost"
                                size="icon"
                                className={`flex-1 h-9 rounded ${(data.styles?.[selectedElement || ""]?.textAlign || "left") === align ? "bg-white shadow-sm" : ""
                                    }`}
                                onClick={() => {
                                    if (selectedElement) {
                                        onChange(`styles.${selectedElement}.textAlign`, align)
                                    } else {
                                        toast({ title: "No Selection", description: "Please select an element to align." })
                                    }
                                }}
                            >
                                {align === "left" && <AlignLeft className="size-4" />}
                                {align === "center" && <AlignCenter className="size-4" />}
                                {align === "right" && <AlignRight className="size-4" />}
                                {align === "justify" && <AlignJustify className="size-4" />}
                            </Button>
                        ))}
                    </div>
                </section>



                {/* Text Section */}
                <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Text</h3>

                    <div className="space-y-2">
                        <Select
                            value={data.styles?.[selectedElement || ""]?.fontFamily || "hellix"}
                            onValueChange={(value) => {
                                if (selectedElement) onChange(`styles.${selectedElement}.fontFamily`, value)
                            }}
                        >
                            <SelectTrigger className="w-full h-10 bg-gray-50 border-none">
                                <SelectValue placeholder="Font Family" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hellix">Hellix</SelectItem>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="roboto">Roboto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Select
                                value={data.styles?.[selectedElement || ""]?.fontWeight || "semibold"}
                                onValueChange={(value) => {
                                    if (selectedElement) onChange(`styles.${selectedElement}.fontWeight`, value)
                                }}
                            >
                                <SelectTrigger className="w-full h-10 bg-gray-50 border-none">
                                    <SelectValue placeholder="Weight" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">SemiBold</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 flex items-center bg-gray-50 rounded-md px-3 h-10">
                            <span className="text-xs font-medium text-gray-400 mr-auto">Aa</span>
                            <Select
                                value={data.styles?.[selectedElement || ""]?.fontSize?.replace('px', '') || "14"}
                                onValueChange={(value) => {
                                    if (selectedElement) onChange(`styles.${selectedElement}.fontSize`, `${value}px`)
                                }}
                            >
                                <SelectTrigger className="w-12 h-6 border-none bg-transparent p-0 text-sm font-bold focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 12, 14, 16, 18, 20, 24, 32, 48].map(size => (
                                        <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-md px-3 h-10 gap-2">
                            <div
                                className="size-4 rounded"
                                style={{ backgroundColor: data.styles?.[selectedElement || ""]?.color || "#244CEC" }}
                            />
                            <span className="text-xs font-bold uppercase truncate">{data.styles?.[selectedElement || ""]?.color || "#244CEC"}</span>
                        </div>
                        <Input
                            type="color"
                            value={data.styles?.[selectedElement || ""]?.color || "#244CEC"}
                            onChange={(e) => {
                                if (selectedElement) onChange(`styles.${selectedElement}.color`, e.target.value)
                            }}
                            className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center bg-gray-50 rounded-md px-3 h-10 gap-2">
                            <span className="text-xs text-gray-400">I</span>
                            <Select
                                value={data.styles?.[selectedElement || ""]?.lineHeight?.replace('%', '').trim() || "160"}
                                onValueChange={(value) => {
                                    if (selectedElement) onChange(`styles.${selectedElement}.lineHeight`, `${value}%`)
                                }}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 text-xs font-bold focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[100, 120, 140, 160, 180, 200].map(lh => (
                                        <SelectItem key={lh} value={lh.toString()}>{lh}%</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center bg-gray-50 rounded-md px-3 h-10 gap-2">
                            <span className="text-xs text-gray-400">H</span>
                            <Select
                                value={data.styles?.[selectedElement || ""]?.letterSpacing?.replace('%', '').trim() || "20.5"}
                                onValueChange={(value) => {
                                    if (selectedElement) onChange(`styles.${selectedElement}.letterSpacing`, `${value}%`)
                                }}
                            >
                                <SelectTrigger className="border-none bg-transparent p-0 text-xs font-bold focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[0, 5, 10, 15, 20.5, 25, 30].map(ls => (
                                        <SelectItem key={ls} value={ls.toString()}>{ls}%</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`flex-1 h-10 rounded hover:bg-white hover:shadow-sm ${data.styles?.[selectedElement || ""]?.bold ? "bg-white shadow-sm" : ""}`}
                            onClick={() => {
                                if (selectedElement) {
                                    const current = data.styles?.[selectedElement]?.bold
                                    onChange(`styles.${selectedElement}.bold`, !current)
                                }
                            }}
                        >
                            <Bold className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`flex-1 h-10 rounded hover:bg-white hover:shadow-sm ${data.styles?.[selectedElement || ""]?.italic ? "bg-white shadow-sm" : ""}`}
                            onClick={() => {
                                if (selectedElement) {
                                    const current = data.styles?.[selectedElement]?.italic
                                    onChange(`styles.${selectedElement}.italic`, !current)
                                }
                            }}
                        >
                            <Italic className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`flex-1 h-10 rounded hover:bg-white hover:shadow-sm ${data.styles?.[selectedElement || ""]?.underline ? "bg-white shadow-sm" : ""}`}
                            onClick={() => {
                                if (selectedElement) {
                                    const current = data.styles?.[selectedElement]?.underline
                                    onChange(`styles.${selectedElement}.underline`, !current)
                                }
                            }}
                        >
                            <Underline className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`flex-1 h-10 rounded hover:bg-white hover:shadow-sm ${data.styles?.[selectedElement || ""]?.strike ? "bg-white shadow-sm" : ""}`}
                            onClick={() => {
                                if (selectedElement) {
                                    const current = data.styles?.[selectedElement]?.strike
                                    onChange(`styles.${selectedElement}.strike`, !current)
                                }
                            }}
                        >
                        </Button>
                    </div>
                </section>

                {/* Size Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Size</h3>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center bg-gray-50 rounded-md px-3 h-10 gap-2">
                            <span className="text-xs text-gray-400 font-bold">↕</span>
                            <span className="text-xs font-bold">860</span>
                            <span className="text-[10px] text-gray-400 ml-auto">px</span>
                        </div>
                        <div className="flex-1 flex items-center bg-gray-50 rounded-md px-3 h-10 gap-2">
                            <span className="text-xs text-gray-400 font-bold">↔</span>
                            <span className="text-xs font-bold">540</span>
                            <span className="text-[10px] text-gray-400 ml-auto">px</span>
                        </div>
                    </div>
                </section>

                {/* Style Effects */}
                <section className="space-y-4 pt-4 border-t">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Style Effects</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-gray-600">Shadow</Label>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded">
                                {data.styles?.[selectedElement || ""]?.shadow || "0"}px
                            </span>
                        </div>
                        <Slider
                            value={[parseInt(data.styles?.[selectedElement || ""]?.shadow || "0")]}
                            max={20}
                            step={1}
                            className="py-1"
                            onValueChange={([val]: number[]) => {
                                if (selectedElement) onChange(`styles.${selectedElement}.shadow`, val.toString())
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-gray-600">Blur</Label>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded">
                                {data.styles?.[selectedElement || ""]?.blur || "0"}px
                            </span>
                        </div>
                        <Slider
                            value={[parseInt(data.styles?.[selectedElement || ""]?.blur || "0")]}
                            max={10}
                            step={0.5}
                            className="py-1"
                            onValueChange={([val]: number[]) => {
                                if (selectedElement) onChange(`styles.${selectedElement}.blur`, val.toString())
                            }}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-gray-600">Opacity</Label>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded">
                                {data.styles?.[selectedElement || ""]?.opacity || "100"}%
                            </span>
                        </div>
                        <Slider
                            value={[parseInt(data.styles?.[selectedElement || ""]?.opacity || "100")]}
                            max={100}
                            step={1}
                            className="py-1"
                            onValueChange={([val]: number[]) => {
                                if (selectedElement) onChange(`styles.${selectedElement}.opacity`, val.toString())
                            }}
                        />
                    </div>
                </section>



            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </aside>
    )
}
