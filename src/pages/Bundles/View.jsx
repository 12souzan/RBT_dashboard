import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box , Chip, Divider } from "@mui/material";
import { useBundle } from "../../context/BundleContext";
import MainLayout from "../../layouts/MainLayout";
import Loading from "../../components/Loading";
import BreadcrumbsTitle from "../../components/Breadcrumbs";

export default function BundleDetails() {
    const { id } = useParams();
    const { currentBundle, isLoading, setIsLoading ,  error, fetchBundleDetails } = useBundle();

    useEffect(() => {
        const loadData = async () => {
            await fetchBundleDetails(id);
            setIsLoading(false);
        };
        if (id) {
            loadData();
            setIsLoading(false);
        }
    }, [id, fetchBundleDetails]);

    if (error || !currentBundle) {
        return (
            <MainLayout>
                <Box className="p-6 text-center text-gray-500">
                    <Typography variant="h6">{error || "Bundle not found"}</Typography>
                </Box>
            </MainLayout>
        );
    }

    if (isLoading) {
        return (
            <Loading />
        )
    }

    const breadcrumbItems = [
        { label: 'Bundles' , path:'/bundles' },
        { label: 'Details'  },
    ];

    return (
        <MainLayout>
            <BreadcrumbsTitle items={breadcrumbItems} />
            <Box className="max-w-2xl mx-auto pt-7 p-4">
                <Card className="rounded-2xl shadow-lg">
                    <CardContent className="space-y-3">
                        <Box className="flex items-center justify-between">
                            <Typography variant="h4">
                                {currentBundle.name}
                            </Typography>
                            <Chip
                                label={currentBundle.active ? "Active" : "Inactive"}
                                color={currentBundle.active ? "primary" : "secondary"}
                            />
                        </Box>
                        <Divider />

                        <Box className="flex flex-col gap-3 pt-2">

                            <Typography variant="h6">
                                <strong className="text-[#df307e]"> Alias: </strong> {currentBundle.alias}
                            </Typography>
                            <Typography variant="h6">
                                <strong className="text-[#1b2b5b]"> RBT Type: </strong> {currentBundle.rbtType}
                            </Typography>
                            <Typography variant="h6">
                                <strong className="text-[#df307e]"> Validity: </strong> {currentBundle.validity} days
                            </Typography>
                            <Typography variant="h6">
                                <strong className="text-[#1b2b5b]"> Grace Period: </strong>{currentBundle.gracePeriod} days
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </MainLayout>
    );
}