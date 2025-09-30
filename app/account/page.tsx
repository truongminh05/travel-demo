"use client";

import {
  UserIcon,
  CalendarIcon,
  SettingsIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  LanguagesIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


type BookingSummary = {
  id: number;
  reference: string | null;
  bookingDate: string | null;
  departureDate: string | null;
  guests: number | null;
  totalAmount: number | null;
  status: string | null;
  tour: {
    id: number;
    slug: string | null;
    title: string | null;
    location: string | null;
    image: string | null;
    duration: string | null;
    averageRating: number;
    price: number;
    originalPrice: number;
  } | null;
  rating: number | null;
};

type SavedTourSummary = {
  id: number;
  slug: string | null;
  title: string;
  location: string | null;
  image: string | null;
  duration: string | null;
  averageRating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  addedDate: string | null;
};

type DashboardStats = {
  totalBookings: number;
  savedTours: number;
  averageSavedRating: number;
};

type AccountOverview = {
  stats: DashboardStats;
  bookings: BookingSummary[];
  upcomingTrips: BookingSummary[];
  recentSaved: SavedTourSummary[];
  favoriteTours: SavedTourSummary[];
  savedTours: SavedTourSummary[];
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/account");
    }
  }, [status, router]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+84 912 345 678",
    address: "123 Đường Chính, Quận 1, TP. HCM",
    bio: "Người đam mê khám phá...",
    avatar: "/placeholder-user.jpg",
  });
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setUserProfile((prev) => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        avatar: user.image || "/placeholder-user.jpg",
      }));
    }
  }, [user]);

  const handleProfileUpdate = (
    field: keyof typeof userProfile,
    value: string
  ) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    bookingReminders: true,
  });

  const [dashboardData, setDashboardData] = useState<AccountOverview | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    let active = true;
    const load = async () => {
      setIsLoadingDashboard(true);
      setDashboardError(null);
      try {
        const res = await fetch("/api/account/overview", { cache: "no-store", credentials: "include" });
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || "Failed to load account overview");
        }
        const data: AccountOverview = await res.json();
        if (active) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("[account] overview error", error);
        if (active) {
          setDashboardError("Không thể tải dữ liệu tài khoản. Vui lòng thử lại sau.");
        }
      } finally {
        if (active) {
          setIsLoadingDashboard(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [status]);

  const bookingHistory = dashboardData?.bookings ?? [];
  const savedTours = dashboardData?.savedTours ?? [];
  const recentSavedTours = dashboardData?.recentSaved ?? [];
  const favoriteTours = dashboardData?.favoriteTours ?? [];
  const upcomingTrips = dashboardData?.upcomingTrips ?? [];
  const overviewStats = dashboardData?.stats;
  const formatCount = (value: number | null | undefined) =>
    new Intl.NumberFormat("vi-VN").format(value ?? 0);
  const formatCurrency = (value: number | null | undefined) =>
    value != null
      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
      : "—";

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "Chưa xác định";
    try {
      return new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };


  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusBadge = (status?: string | null) => {
    const normalized = (status ?? "pending").toLowerCase();
    switch (normalized) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Sắp tới</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Đang xử lý</Badge>;
    }
  };

  const removeSavedTour = (tourId: number | string) => {
    console.log("Xóa tour đã lưu:", tourId);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải dữ liệu tài khoản...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={userProfile.avatar}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
              />
              <AvatarFallback>
                {userProfile.firstName?.[0]}
                {userProfile.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Chào mừng trở lại, {userProfile.firstName.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Quản lý đặt chỗ, tour đã lưu và cài đặt tài khoản
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Đặt chỗ
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <HeartIcon className="w-4 h-4" />
                Yêu thích
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <BellIcon className="w-4 h-4" />
                Thông báo
              </TabsTrigger>
            </TabsList>

            {/* Nội dung các tab */}
            {/* === Tổng quan === */}
            <TabsContent value="overview" className="space-y-8">
              {dashboardError && (
                <p className="text-sm text-destructive">{dashboardError}</p>
              )}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoadingDashboard && !dashboardData ? "..." : formatCount(overviewStats?.totalBookings ?? 0)}</p>
                        <p className="text-sm text-muted-foreground">
                          Tổng số đặt chỗ
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <HeartIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {isLoadingDashboard && !dashboardData ? "..." : formatCount(overviewStats?.savedTours ?? savedTours.length)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tour đã lưu
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{isLoadingDashboard && !dashboardData ? "..." : (overviewStats ? overviewStats.averageSavedRating.toFixed(1) : "0.0")}</p>
                        <p className="text-sm text-muted-foreground">
                          Điểm đánh giá trung bình
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hoạt động gần đây */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>                  <div className="space-y-4">
                    {isLoadingDashboard && !dashboardData && (
                      <p className="text-sm text-muted-foreground">Đang tải hoạt động...</p>
                    )}
                    {!isLoadingDashboard && dashboardData &&
                      upcomingTrips.length === 0 &&
                      recentSavedTours.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Chưa có hoạt động gần đây.
                        </p>
                      )}
                    {upcomingTrips.map((booking) => (
                      <div
                        key={`upcoming-${booking.id}`}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {booking.tour?.title || "Chuyến đi sắp tới"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Khởi hành {formatDate(booking.departureDate)}
                          </p>
                        </div>
                        {booking.tour?.slug ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tours/${booking.tour.slug}`}>Xem chi tiết</Link>
                          </Button>
                        ) : null}
                      </div>
                    ))}
                    {recentSavedTours.map((tour) => (
                      <div
                        key={`saved-${tour.id}`}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <HeartIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Đã lưu {tour.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {tour.location || "Tour yêu thích"}
                          </p>
                        </div>
                        {tour.slug ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tours/${tour.slug}`}>Xem tour</Link>
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === Đặt chỗ === */}
            <TabsContent value="bookings" className="space-y-6">
              {dashboardError && (
                <p className="text-sm text-destructive">{dashboardError}</p>
              )}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Đặt chỗ của bạn</h2>
                <Button asChild>
                  <Link href="/#tours">Đặt tour mới</Link>
                </Button>
              </div>

              <div className="space-y-6">
                {isLoadingDashboard && !dashboardData && (
                  <p className="text-sm text-muted-foreground">Đang tải lịch sử đặt chỗ...</p>
                )}
                {!isLoadingDashboard && bookingHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Bạn chưa có đặt chỗ nào.
                  </p>
                )}
                {bookingHistory.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-6 items-center">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                          <Image
                            src={booking.tour?.image || "/placeholder.svg"}
                            alt={booking.tour?.title || "Tour đã đặt"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {booking.tour?.title || "Tour đã đặt"}
                            </h3>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              <span>{booking.tour?.location || "Đang cập nhật"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatDate(booking.departureDate)}</span>
                            </div>
                            <p>
                              Mã đặt chỗ: {booking.reference || `#${booking.id}`}
                            </p>
                            <p>Số khách: {booking.guests ?? "—"}</p>
                          </div>
                          {booking.rating ? (
                            <div className="flex items-center gap-1 mt-2">
                              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">
                                Bạn đã đánh giá {booking.rating}/5
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Tổng thanh toán
                          </p>
                          <div className="space-y-2">
                            {booking.tour?.slug ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                asChild
                              >
                                <Link href={`/tours/${booking.tour.slug}`}>
                                  <EyeIcon className="w-4 h-4 mr-2" />
                                  Xem chi tiết tour
                                </Link>
                              </Button>
                            ) : null}
                            {booking.status === "upcoming" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                              >
                                Quản lý đặt chỗ
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* === Yêu thích === */}
            <TabsContent value="wishlist" className="space-y-6">
              {dashboardError && (
                <p className="text-sm text-destructive">{dashboardError}</p>
              )}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tour yêu thích của bạn</h2>
                <p className="text-muted-foreground">
                  {isLoadingDashboard && !dashboardData ? "..." : formatCount(overviewStats?.savedTours ?? savedTours.length)} tour đã lưu
                </p>
              </div>

              {isLoadingDashboard && !dashboardData && (
                <p className="text-sm text-muted-foreground">Đang tải danh sách tour đã lưu...</p>
              )}
              {!isLoadingDashboard && savedTours.length === 0 && (
                <p className="text-sm text-muted-foreground">Bạn chưa lưu tour nào.</p>
              )}
              {favoriteTours.length > 0 && (
                <Card className="bg-muted/40">
                  <CardHeader className="pb-2">
                    <CardTitle>Tour được đánh giá cao</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {favoriteTours.map((tour) => (
                      <div
                        key={`favorite-${tour.id}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">{tour.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {tour.location || "Đang cập nhật"}
                          </p>
                        </div>
                        <StarRating value={tour.averageRating} size="sm" showValue={false} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTours.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={tour.image || "/placeholder.svg"}
                        alt={tour.title}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => removeSavedTour(tour.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{tour.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{tour.location || "Đang cập nhật"}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <StarRating
                          value={tour.averageRating}
                          reviewCount={tour.reviewCount}
                          size="sm"
                        />
                        {tour.duration && (
                          <span className="text-sm text-muted-foreground">
                            {tour.duration}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {tour.originalPrice > tour.price && tour.originalPrice ? (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              {formatCurrency(tour.originalPrice)}
                            </span>
                          ) : null}
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(tour.price)}
                          </span>
                        </div>
                        {tour.slug ? (
                          <Button size="sm" asChild>
                            <Link href={`/tours/${tour.slug}`}>Xem tour</Link>
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* === Hồ sơ === */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <h2 className="text-2xl font-bold">Cài đặt hồ sơ</h2>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <EditIcon className="w-4 h-4 mr-2" />
                  {isEditing ? "Lưu thay đổi" : "Chỉnh sửa hồ sơ"}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Tên</Label>
                        <Input
                          id="firstName"
                          value={userProfile.firstName}
                          onChange={(e) =>
                            handleProfileUpdate("firstName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Họ</Label>
                        <Input
                          id="lastName"
                          value={userProfile.lastName}
                          onChange={(e) =>
                            handleProfileUpdate("lastName", e.target.value)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Địa chỉ email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) =>
                          handleProfileUpdate("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={userProfile.phone}
                        onChange={(e) =>
                          handleProfileUpdate("phone", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        value={userProfile.address}
                        onChange={(e) =>
                          handleProfileUpdate("address", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Giới thiệu</Label>
                      <Textarea
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) =>
                          handleProfileUpdate("bio", e.target.value)
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hành động tài khoản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <CreditCardIcon className="w-4 h-4 mr-2" />
                      Phương thức thanh toán
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Tải xuống dữ liệu của tôi
                    </Button>

                    <Separator />

                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOutIcon className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* === Thông báo === */}
            <TabsContent value="preferences" className="space-y-6">
              <h2 className="text-2xl font-bold">Tùy chọn thông báo</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt liên lạc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="emailNotifications"
                        className="text-base font-medium"
                      >
                        Thông báo qua Email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận xác nhận đặt chỗ và cập nhật
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="smsNotifications"
                        className="text-base font-medium"
                      >
                        Thông báo qua SMS
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận tin nhắn cho các cập nhật khẩn
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("smsNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="marketingEmails"
                        className="text-base font-medium"
                      >
                        Email khuyến mãi
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận ưu đãi đặc biệt và tour mới
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("marketingEmails", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="bookingReminders"
                        className="text-base font-medium"
                      >
                        Nhắc nhở đặt chỗ
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận nhắc nhở trước chuyến đi
                      </p>
                    </div>
                    <Switch
                      id="bookingReminders"
                      checked={preferences.bookingReminders}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("bookingReminders", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
