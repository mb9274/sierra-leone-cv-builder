"use client"

import { Button } from "@/components/ui/button"
import {
    Undo2,
    Redo2,
    Share2,
    Download,
    ChevronRight,
    Lightbulb,
    ClipboardCheck,
    ChevronDown,
    MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TopBarProps {
    onDownload?: () => void
    onShare?: () => void
    onAIAssist?: () => void
    onMore?: () => void
    onUndo?: () => void
    onRedo?: () => void
    zoomLevel?: number
    setZoomLevel?: (level: number) => void
    isSaved?: boolean
    canUndo?: boolean
    canRedo?: boolean
}

export function TopBar({
    onDownload,
    onShare,
    onAIAssist,
    onMore,
    onUndo,
    onRedo,
    zoomLevel = 32,
    setZoomLevel,
    isSaved = true,
    canUndo = false,
    canRedo = false
}: TopBarProps) {
    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-2 sm:px-4 md:px-6 sticky top-0 z-50">
            {/* Left: Breadcrumbs - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex items-center gap-4">
                <div className="size-8 rounded bg-black flex items-center justify-center">
                    <div className="size-4 bg-white rounded-full translate-x-1" />
                </div>
                <nav className="flex items-center text-sm text-gray-500 gap-2">
                    <Link href="/dashboard" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight className="size-4" />
                    <Link href="/dashboard" className="hover:text-black transition-colors">Project</Link>
                    <ChevronRight className="size-4" />
                    <span className="text-black font-medium">My Resume</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 ml-2 hover:bg-gray-100"
                        onClick={onMore}
                    >
                        <MoreHorizontal className="size-4" />
                    </Button>

                    <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                        <ClipboardCheck className="size-3" />
                        <span>{isSaved ? "Saved" : "Saving..."}</span>
                    </div>
                </nav>
            </div>

            {/* Mobile: Just logo and saved status */}
            <div className="md:hidden flex items-center gap-4">
                <div className="size-8 rounded bg-black flex items-center justify-center">
                    <div className="size-4 bg-white rounded-full translate-x-1" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                    <ClipboardCheck className="size-3" />
                    <span>{isSaved ? "Saved" : "Saving..."}</span>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 border-r pr-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onUndo} 
                        disabled={!canUndo}
                        className="size-8 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Undo2 className="size-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onRedo} 
                        disabled={!canRedo}
                        className="size-8 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Redo2 className="size-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={zoomLevel.toString()} onValueChange={(value) => setZoomLevel?.(parseInt(value))}>
                        <SelectTrigger className="w-20 h-8 border-gray-200 bg-white">
                            <SelectValue placeholder="Zoom" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="25">25%</SelectItem>
                            <SelectItem value="32">32%</SelectItem>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="75">75%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                            <SelectItem value="150">150%</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Right: Actions - Stack on mobile */}
            <div className="flex items-center gap-2 md:gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full size-10 border-gray-200 hover:bg-gray-50 md:flex hidden"
                    onClick={onAIAssist}
                >
                    <Lightbulb className="size-5" />
                </Button>
                <Button
                    variant="outline"
                    className="h-10 px-3 md:px-4 gap-2 border-gray-200 hover:bg-gray-50 text-sm"
                    onClick={onDownload}
                >
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Download</span>
                </Button>
                <Button
                    className="h-10 px-4 md:px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    onClick={onShare}
                >
                    <Share2 className="size-4" />
                    <span className="hidden sm:inline">Share</span>
                </Button>
            </div>
        </header>
    )
}
