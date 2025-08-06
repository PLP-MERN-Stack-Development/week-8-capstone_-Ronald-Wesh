import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Trash2, MapPin, Calendar, User, Eye, Bed, Bath, Square, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ListingCard({ 
    listing, 
    onVerify, 
    onDelete, 
    onSave,
    isSaved = false,
    showActions = true,
    showSaveButton = false,
    onViewDetails,
    onNavigateToDetails 
}) {
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleVerify = async () => {
        if (!onVerify) return;
        
        setIsVerifying(true);
        try {
            await onVerify(listing._id);
        } catch (error) {
            console.error("Error verifying listing:", error);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        
        setIsDeleting(true);
        try {
            await onDelete(listing._id);
        } catch (error) {
            console.error("Error deleting listing:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails();
        } else if (onNavigateToDetails) {
            onNavigateToDetails(listing._id);
        }
    };

    const handleSave = async () => {
        if (!onSave) return;
        
        setIsSaving(true);
        try {
            await onSave(listing._id);
        } catch (error) {
            console.error("Error saving property:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Default placeholder image
    const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNDBIMTc1VjEwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHA+dGggZD0iTTE1MCA4MEgyNTBWMTYwSDE1MFY4MFoiIHN0cm9rZT0iI0QxRDVEQiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUM5Qzk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

    const displayImage = imageError || !listing.images || listing.images.length === 0 
        ? placeholderImage 
        : listing.images[0];

    return (
        <Card className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
            ${listing.verified ? "border-green-200 dark:border-green-800 shadow-green-100 dark:shadow-green-900/20" : "border-slate-200 dark:border-slate-700"}`}>
            
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-700">
                <img
                    src={displayImage}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={handleImageError}
                />
                  
                {/* Verification Badge */}
                {listing.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                    </div>
                )}

                {/* Save Button for Tenants */}
                {showSaveButton && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }}
                        className={`absolute top-3 left-3 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                            isSaved 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-white/90 hover:bg-white text-slate-700'
                        }`}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isSaved ? (
                            <Heart className="w-4 h-4 fill-current" />
                        ) : (
                            <Heart className="w-4 h-4" />
                        )}
                    </button>
                )}

                {/* Image Count Badge */}
                {listing.images && listing.images.length > 1 && !imageError && (
                    <div className={`absolute ${showSaveButton ? 'top-3 right-12' : 'top-3 right-3'} bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
                        <Eye className="h-3 w-3" />
                        {listing.images.length}
                    </div>
                )}
            </div>

            {/* Header Section */}
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {listing.title}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{listing.address || listing.location}</span>
                </div>
            </CardHeader>

            {/* Content Section */}
            <CardContent className="pb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-3">
                    {listing.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        KSh {listing.price?.toLocaleString()}
                    </span>
                </div>

                {/* Property Details */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    {listing.bedrooms && (
                        <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            <span>{listing.bedrooms} beds</span>
                        </div>
                    )}
                    {listing.bathrooms && (
                        <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            <span>{listing.bathrooms} baths</span>
                        </div>
                    )}
                    {listing.area && (
                        <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            <span>{listing.area} sq ft</span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleViewDetails}
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-2 rounded-lg font-medium transition-all duration-200 mb-3"
                >
                    View Details
                </button>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Listed {formatDate(listing.createdAt)}</span>
                    </div>

                    {listing.createdBy?.username && (
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-20">{listing.createdBy.username}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Action Buttons */}
            {showActions && (
                <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button
                        size="sm"
                        variant={listing.verified ? "outline" : "secondary"}
                        onClick={handleVerify}
                        disabled={isVerifying}
                        title={listing.verified ? "Remove verification" : "Verify listing"}
                        className="flex items-center gap-1"
                    >
                        {isVerifying ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <CheckCircle className={`h-4 w-4 ${listing.verified ? "text-green-600" : ""}`} />
                        )}
                        {listing.verified ? "Unverify" : "Verify"}
                    </Button>
                    
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Delete listing"
                        className="flex items-center gap-1"
                    >
                        {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}