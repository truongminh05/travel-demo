-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."BlogPosts" (
    "PostID" SERIAL NOT NULL,
    "PostSlug" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Excerpt" TEXT,
    "Content" TEXT NOT NULL,
    "Image" TEXT,
    "AuthorID" INTEGER,
    "PublishedDate" TIMESTAMP(6),
    "ReadTimeMinutes" INTEGER,
    "Category" TEXT,
    "IsFeatured" BOOLEAN,
    "Status" TEXT,
    "CreatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6),
    "Tags" TEXT[],
    "AuthorName" TEXT,
    "AuthorImage" TEXT,
    "AuthorBio" TEXT,

    CONSTRAINT "BlogPosts_pkey" PRIMARY KEY ("PostID")
);

-- CreateTable
CREATE TABLE "public"."Bookings" (
    "BookingID" SERIAL NOT NULL,
    "BookingReference" TEXT NOT NULL,
    "UserID" INTEGER NOT NULL,
    "TourID" INTEGER NOT NULL,
    "BookingDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "DepartureDate" TIMESTAMP(6) NOT NULL,
    "NumberOfGuests" INTEGER NOT NULL,
    "Subtotal" DECIMAL(10,2) NOT NULL,
    "Taxes" DECIMAL(10,2),
    "TotalAmount" DECIMAL(10,2) NOT NULL,
    "Status" TEXT,
    "SpecialRequests" TEXT,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("BookingID")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "PaymentID" SERIAL NOT NULL,
    "BookingID" INTEGER,
    "PaymentDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Amount" DECIMAL(10,2),
    "PaymentMethod" TEXT,
    "TransactionID" TEXT,
    "Status" TEXT,
    "CreatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("PaymentID")
);

-- CreateTable
CREATE TABLE "public"."Reviews" (
    "ReviewID" SERIAL NOT NULL,
    "TourID" INTEGER,
    "UserID" INTEGER,
    "BookingID" INTEGER,
    "Rating" INTEGER,
    "Comment" TEXT,
    "ReviewDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "public"."TourGallery" (
    "ImageID" SERIAL NOT NULL,
    "TourID" INTEGER,
    "ImageURL" TEXT,
    "Caption" TEXT,

    CONSTRAINT "TourGallery_pkey" PRIMARY KEY ("ImageID")
);

-- CreateTable
CREATE TABLE "public"."TourHighlights" (
    "HighlightID" SERIAL NOT NULL,
    "TourID" INTEGER,
    "HighlightText" TEXT,

    CONSTRAINT "TourHighlights_pkey" PRIMARY KEY ("HighlightID")
);

-- CreateTable
CREATE TABLE "public"."TourItinerary" (
    "ItineraryID" SERIAL NOT NULL,
    "TourID" INTEGER,
    "DayNumber" INTEGER,
    "Title" TEXT,
    "Description" TEXT,

    CONSTRAINT "TourItinerary_pkey" PRIMARY KEY ("ItineraryID")
);

-- CreateTable
CREATE TABLE "public"."Tours" (
    "TourID" SERIAL NOT NULL,
    "TourSlug" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(10,2),
    "MaxGuests" INTEGER,
    "Included" TEXT,
    "NotIncluded" TEXT,
    "DepartureInfo" TEXT,
    "CoverImage" TEXT,
    "AverageRating" DECIMAL(3,2) DEFAULT 0.00,
    "Status" TEXT,
    "CreatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "Image" TEXT,
    "Location" TEXT,
    "OriginalPrice" DECIMAL(10,2),
    "ReviewCount" TEXT,
    "Duration" TEXT,
    "CancellationPolicy" TEXT,
    "Category" TEXT,
    "EndDate" TIMESTAMP(6),
    "StartDate" TIMESTAMP(6),
    "UpdatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Tours_pkey" PRIMARY KEY ("TourID")
);

-- CreateTable
CREATE TABLE "public"."Users" (
    "UserID" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "FullName" TEXT,
    "ProfilePicture" TEXT,
    "Role" TEXT DEFAULT 'Customer',
    "CreatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "public"."Wishlists" (
    "WishlistID" SERIAL NOT NULL,
    "UserID" INTEGER,
    "TourID" INTEGER,
    "AddedDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlists_pkey" PRIMARY KEY ("WishlistID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_BookingReference_key" ON "public"."Bookings"("BookingReference");

-- CreateIndex
CREATE INDEX "Bookings_TourID_idx" ON "public"."Bookings"("TourID");

-- CreateIndex
CREATE INDEX "Bookings_UserID_idx" ON "public"."Bookings"("UserID");

-- CreateIndex
CREATE INDEX "Reviews_TourID_idx" ON "public"."Reviews"("TourID");

-- CreateIndex
CREATE INDEX "Reviews_UserID_idx" ON "public"."Reviews"("UserID");

-- CreateIndex
CREATE UNIQUE INDEX "Tours_TourSlug_key" ON "public"."Tours"("TourSlug");

-- CreateIndex
CREATE INDEX "Tours_Location_idx" ON "public"."Tours"("Location");

-- CreateIndex
CREATE INDEX "Tours_Category_idx" ON "public"."Tours"("Category");

-- CreateIndex
CREATE INDEX "Tours_StartDate_idx" ON "public"."Tours"("StartDate");

-- CreateIndex
CREATE INDEX "Tours_EndDate_idx" ON "public"."Tours"("EndDate");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Username_key" ON "public"."Users"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "public"."Users"("Email");

-- CreateIndex
CREATE INDEX "Wishlists_UserID_idx" ON "public"."Wishlists"("UserID");

-- AddForeignKey
ALTER TABLE "public"."Bookings" ADD CONSTRAINT "Bookings_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Bookings" ADD CONSTRAINT "Bookings_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_BookingID_fkey" FOREIGN KEY ("BookingID") REFERENCES "public"."Bookings"("BookingID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_BookingID_fkey" FOREIGN KEY ("BookingID") REFERENCES "public"."Bookings"("BookingID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Reviews" ADD CONSTRAINT "Reviews_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TourGallery" ADD CONSTRAINT "TourGallery_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TourHighlights" ADD CONSTRAINT "TourHighlights_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TourItinerary" ADD CONSTRAINT "TourItinerary_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Wishlists" ADD CONSTRAINT "Wishlists_TourID_fkey" FOREIGN KEY ("TourID") REFERENCES "public"."Tours"("TourID") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Wishlists" ADD CONSTRAINT "Wishlists_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "public"."Users"("UserID") ON DELETE NO ACTION ON UPDATE NO ACTION;

