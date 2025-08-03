import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Trash2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListingCard({ listing, onVerify, onDelete, showActions = true }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className={`relative animation-fade ${listing.verified ? "border-green-200" : ""}`}>
            {listing.images && listing.images.length > 0 && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    {listing.verified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                        </div>
                    )}
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {listing.title}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.address}</span>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                    {listing.description}
                </p>

                <div className="flex items-center gap-1 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-3 w-3" />
                    <span>Listed {formatDate(listing.createdAt)}</span>
                </div>
            </CardContent>

            {showActions && (
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        size="icon"
                        variant={listing.verified ? "outline" : "secondary"}
                        onClick={() => {
                            console.log("Toggling verification for listing:", listing._id);
                            onVerify(listing._id);
                        }}
                        title={listing.verified ? "Remove verification" : "Verify listing"}
                    >
                        <CheckCircle className={`h-5 w-5 ${listing.verified ? "text-green-600" : ""}`} />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(listing._id)}
                        title="Delete listing"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}