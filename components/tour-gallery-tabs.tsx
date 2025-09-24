"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export type GalleryCard = {
  key: string;
  image: string;
  title: string;
  body: string;
};

type ScheduleSection = {
  day: number;
  title: string;
  description: string;
  images: GalleryCard[];
};

type ServiceSection = {
  key: string;
  label: string;
  images: GalleryCard[];
};

export default function TourGalleryTabs({
  schedule,
  services,
}: {
  schedule: ScheduleSection[];
  services: ServiceSection[];
}) {
  const hasSchedule = schedule.length > 0;
  const hasServices = services.length > 0;

  const defaultScheduleDay = useMemo(() => {
    const withImages = schedule.find((section) => section.images.length > 0);
    return withImages?.day ?? schedule[0]?.day ?? null;
  }, [schedule]);

  const defaultServiceKey = useMemo(() => {
    const withImages = services.find((section) => section.images.length > 0);
    return withImages?.key ?? services[0]?.key ?? null;
  }, [services]);

  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(
    defaultScheduleDay
  );
  const [selectedService, setSelectedService] = useState<string | null>(
    defaultServiceKey
  );

  useEffect(() => {
    setSelectedSchedule(defaultScheduleDay);
  }, [defaultScheduleDay]);

  useEffect(() => {
    setSelectedService(defaultServiceKey);
  }, [defaultServiceKey]);

  const scheduleMap = useMemo(() => {
    const map = new Map<number, ScheduleSection>();
    schedule.forEach((section) => map.set(section.day, section));
    return map;
  }, [schedule]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, ServiceSection>();
    services.forEach((section) => map.set(section.key, section));
    return map;
  }, [services]);

  const activeSchedule =
    selectedSchedule != null ? scheduleMap.get(selectedSchedule) : undefined;
  const activeService =
    selectedService != null ? serviceMap.get(selectedService) : undefined;
  const [activeTab, setActiveTab] = useState<"schedule" | "services">(
    hasSchedule ? "schedule" : "services"
  );

  useEffect(() => {
    if (hasSchedule) {
      setActiveTab("schedule");
    } else if (hasServices) {
      setActiveTab("services");
    }
  }, [hasSchedule, hasServices]);

  if (!hasSchedule && !hasServices) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Chưa có hình ảnh minh hoạ cho tour này.
      </div>
    );
  }

  const renderCards = (cards: GalleryCard[]) => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.key}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative aspect-[16/9]">
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-6 space-y-3">
            <span className="font-semibold text-lg line-clamp-2">
              {card.title}
            </span>
            {card.body && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {card.body}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as "schedule" | "services")}
      className="space-y-6"
    >
      <TabsList>
        <TabsTrigger value="schedule" disabled={!hasSchedule}>
          Lịch trình
        </TabsTrigger>
        <TabsTrigger value="services" disabled={!hasServices}>
          Dịch vụ bao gồm
        </TabsTrigger>
      </TabsList>

      <TabsContent value="schedule" className="space-y-4">
        {hasSchedule ? (
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-2">
              {schedule.map((section) => (
                <Button
                  key={section.day}
                  variant={
                    section.day === selectedSchedule ? "default" : "outline"
                  }
                  className="w-full justify-between items-center px-4 py-3 text-left"
                  onClick={() => setSelectedSchedule(section.day)}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">
                      {`Ngày ${section.day}`}
                    </span>
                    {section.title && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {section.title}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary">{section.images.length}</Badge>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {activeSchedule ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {activeSchedule.title || `Ngày ${activeSchedule.day}`}
                    </h3>
                    {activeSchedule.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {activeSchedule.description}
                      </p>
                    )}
                  </div>

                  {activeSchedule.images.length ? (
                    renderCards(activeSchedule.images)
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có ảnh cho ngày này.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chọn một ngày trong lịch trình để xem ảnh minh hoạ.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có lịch trình để hiển thị.
          </p>
        )}
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        {hasServices ? (
          <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
            <div className="space-y-2">
              {services.map((section) => (
                <Button
                  key={section.key}
                  variant={
                    section.key === selectedService ? "default" : "outline"
                  }
                  className="w-full justify-between items-center px-4 py-3 text-left"
                  onClick={() => setSelectedService(section.key)}
                >
                  <span className="text-sm font-medium truncate max-w-[160px]">
                    {section.label}
                  </span>
                  <Badge variant="secondary">{section.images.length}</Badge>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {activeService ? (
                <>
                  <h3 className="text-lg font-semibold max-w-[320px] truncate">
                    {activeService.label}
                  </h3>
                  {activeService.images.length ? (
                    renderCards(activeService.images)
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có ảnh cho dịch vụ này.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chọn một dịch vụ để xem ảnh minh hoạ.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có dịch vụ bao gồm để hiển thị.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
