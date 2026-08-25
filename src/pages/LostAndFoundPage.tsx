import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  MapPin,
  Calendar,
  PawPrint,
  X,
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
  Database,
  User,
} from "lucide-react";

import {
  lostFoundApi,
  LostFoundReport,
  LostFoundType,
} from "../services/lostFound";

import { useApp } from "../context/AppContext";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type Species =
  | "dog"
  | "cat"
  | "rabbit";

type FaceStructure =
  | "round"
  | "long"
  | "pointed"
  | "flat";

/*
|--------------------------------------------------------------------------
| FIXED SAMPLE REPORTS
|--------------------------------------------------------------------------
|
| These are NOT saved to MongoDB.
|
| They exist only so the page looks populated
| when the database has few/no reports.
|
|--------------------------------------------------------------------------
*/

interface FixedReport {
  id: string;

  type: LostFoundType;

  petName: string;

  species: Species;

  breed: string;

  color: string;

  eyeColor: string;

  faceStructure: FaceStructure;

  lastLocation: string;

  contactName: string;

  contactPhone: string;

  photoUrl: string;

  reportedDate: string;

  isFixed: true;
}

const FIXED_LOST_REPORTS: FixedReport[] = [
  {
    id: "fixed-lost-1",

    type: "lost",

    petName: "Max",

    species: "dog",

    breed: "Golden Retriever",

    color: "Golden",

    eyeColor: "Brown",

    faceStructure: "long",

    lastLocation:
      "GEC Circle, Chattogram",

    contactName:
      "FurCare Community",

    contactPhone:
      "01700000000",

    photoUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",

    reportedDate:
      "2026-08-20",

    isFixed: true,
  },

  {
    id: "fixed-lost-2",

    type: "lost",

    petName: "Mimi",

    species: "cat",

    breed: "Persian",

    color: "White",

    eyeColor: "Blue",

    faceStructure: "flat",

    lastLocation:
      "Khulshi, Chattogram",

    contactName:
      "FurCare Community",

    contactPhone:
      "01700000000",

    photoUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",

    reportedDate:
      "2026-08-18",

    isFixed: true,
  },
];

const FIXED_FOUND_REPORTS: FixedReport[] = [
  {
    id: "fixed-found-1",

    type: "found",

    petName: "Unknown Dog",

    species: "dog",

    breed: "Labrador",

    color: "Black",

    eyeColor: "Brown",

    faceStructure: "long",

    lastLocation:
      "Agrabad, Chattogram",

    contactName:
      "FurCare Community",

    contactPhone:
      "01700000000",

    photoUrl:
      "https://images.unsplash.com/photo-1580917959512-c929a13321b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjBkb2d8ZW58MHx8MHx8fDA%3D",

    reportedDate:
      "2026-08-21",

    isFixed: true,
  },

  {
    id: "fixed-found-2",

    type: "found",

    petName: "Unknown Cat",

    species: "cat",

    breed: "Domestic Cat",

    color: "Orange",

    eyeColor: "Green",

    faceStructure: "round",

    lastLocation:
      "Nasirabad, Chattogram",

    contactName:
      "FurCare Community",

    contactPhone:
      "01700000000",

    photoUrl:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",

    reportedDate:
      "2026-08-19",

    isFixed: true,
  },
];

/*
|--------------------------------------------------------------------------
| DEFAULT IMAGES
|--------------------------------------------------------------------------
*/

const PET_IMAGES: Record<
  Species,
  string
> = {
  dog:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",

  cat:
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",

  rabbit:
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export const LostAndFoundPage: React.FC =
  () => {
    const {
      addToast,
      requireAuth,
    } = useApp();

    /*
    |--------------------------------------------------------------------------
    | DATABASE REPORTS
    |--------------------------------------------------------------------------
    */

    const [
      databaseReports,
      setDatabaseReports,
    ] = useState<
      LostFoundReport[]
    >([]);

    const [
      myReports,
      setMyReports,
    ] = useState<
      LostFoundReport[]
    >([]);

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    const [
      isLoading,
      setIsLoading,
    ] = useState(true);

    const [
      isLoadingMine,
      setIsLoadingMine,
    ] = useState(false);

    const [
      isSubmitting,
      setIsSubmitting,
    ] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | MODAL
    |--------------------------------------------------------------------------
    */

    const [
      isModalOpen,
      setIsModalOpen,
    ] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | FORM
    |--------------------------------------------------------------------------
    */

    const [
      reportType,
      setReportType,
    ] = useState<LostFoundType>(
      "lost"
    );

    const [
      petName,
      setPetName,
    ] = useState("");

    const [
      species,
      setSpecies,
    ] = useState<Species>(
      "dog"
    );

    const [
      breed,
      setBreed,
    ] = useState("");

    const [
      color,
      setColor,
    ] = useState("");

    const [
      eyeColor,
      setEyeColor,
    ] = useState("");

    const [
      faceStructure,
      setFaceStructure,
    ] = useState<FaceStructure>(
      "round"
    );

    const [
      collarNeckband,
      setCollarNeckband,
    ] = useState("");

    const [
      birthmarkOrFeature,
      setBirthmarkOrFeature,
    ] = useState("");

    const [
      lastWearCloth,
      setLastWearCloth,
    ] = useState("");

    const [
      lastLocation,
      setLastLocation,
    ] = useState("");

    const [
      contactName,
      setContactName,
    ] = useState("");

    const [
      contactPhone,
      setContactPhone,
    ] = useState("");

    const [
      selectedImage,
      setSelectedImage,
    ] = useState<File | null>(
      null
    );

    const [
      imagePreview,
      setImagePreview,
    ] = useState("");

    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const [
      activeTab,
      setActiveTab,
    ] = useState<
      "all" | "lost" | "found"
    >("all");

    /*
    |--------------------------------------------------------------------------
    | LOAD ALL DATABASE REPORTS
    |--------------------------------------------------------------------------
    */

    const loadReports =
      async () => {
        try {
          setIsLoading(true);

          const reports =
            await lostFoundApi.getAllReports();

          setDatabaseReports(
            reports
          );
        } catch (error) {
          console.error(
            "Failed to load lost/found reports:",
            error
          );

          addToast(
            "Could not load reports from the database.",
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      };

    /*
    |--------------------------------------------------------------------------
    | LOAD CURRENT USER REPORTS
    |--------------------------------------------------------------------------
    */

    const loadMyReports =
      async () => {
        try {
          setIsLoadingMine(true);

          const reports =
            await lostFoundApi.getMyReports();

          setMyReports(
            reports
          );
        } catch (error) {
          console.error(
            "Failed to load my reports:",
            error
          );
        } finally {
          setIsLoadingMine(false);
        }
      };

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
      loadReports();
      loadMyReports();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | IMAGE CHANGE
    |--------------------------------------------------------------------------
    */

    const handleImageChange =
      (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file =
          event.target.files?.[0];

        if (!file) {
          return;
        }

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (
          !allowedTypes.includes(
            file.type
          )
        ) {
          addToast(
            "Please upload JPG, PNG or WEBP image.",
            "error"
          );

          event.target.value =
            "";

          return;
        }

        if (
          file.size >
          10 * 1024 * 1024
        ) {
          addToast(
            "Image must be smaller than 10 MB.",
            "error"
          );

          event.target.value =
            "";

          return;
        }

        setSelectedImage(
          file
        );

        const previewUrl =
          URL.createObjectURL(
            file
          );

        setImagePreview(
          previewUrl
        );
      };

    /*
    |--------------------------------------------------------------------------
    | RESET FORM
    |--------------------------------------------------------------------------
    */

    const resetForm =
      () => {
        setReportType(
          "lost"
        );

        setPetName("");

        setSpecies(
          "dog"
        );

        setBreed("");

        setColor("");

        setEyeColor("");

        setFaceStructure(
          "round"
        );

        setCollarNeckband("");

        setBirthmarkOrFeature(
          ""
        );

        setLastWearCloth("");

        setLastLocation("");

        setContactName("");

        setContactPhone("");

        setSelectedImage(
          null
        );

        setImagePreview("");
      };

    /*
    |--------------------------------------------------------------------------
    | OPEN REPORT MODAL
    |--------------------------------------------------------------------------
    */

    const openReportModal =
      (
        type: LostFoundType
      ) => {
        if (!requireAuth()) {
          return;
        }

        setReportType(
          type
        );

        setIsModalOpen(
          true
        );
      };

    /*
    |--------------------------------------------------------------------------
    | CLOSE MODAL
    |--------------------------------------------------------------------------
    */

    const closeModal =
      () => {
        if (
          isSubmitting
        ) {
          return;
        }

        setIsModalOpen(
          false
        );

        resetForm();
      };

    /*
    |--------------------------------------------------------------------------
    | CREATE REPORT
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
      async (
        event: React.FormEvent
      ) => {
        event.preventDefault();

        if (!requireAuth()) {
          return;
        }

        if (
          !selectedImage
        ) {
          addToast(
            "Please upload a pet image.",
            "error"
          );

          return;
        }

        if (
          !breed.trim() ||
          !color.trim() ||
          !eyeColor.trim() ||
          !lastLocation.trim() ||
          !contactName.trim() ||
          !contactPhone.trim()
        ) {
          addToast(
            "Please complete all required fields.",
            "error"
          );

          return;
        }

        try {
          setIsSubmitting(
            true
          );

          const created =
            await lostFoundApi.createReport(
              {
                type:
                  reportType,

                petName:
                  petName.trim() ||
                  undefined,

                species,

                breed:
                  breed.trim(),

                color:
                  color.trim(),

                eyeColor:
                  eyeColor.trim(),

                faceStructure,

                collarNeckband:
                  collarNeckband.trim() ||
                  undefined,

                birthmarkOrFeature:
                  birthmarkOrFeature.trim() ||
                  undefined,

                lastWearCloth:
                  lastWearCloth.trim() ||
                  undefined,

                lastLocation:
                  lastLocation.trim(),

                contactName:
                  contactName.trim(),

                contactPhone:
                  contactPhone.trim(),

                image:
                  selectedImage,
              }
            );

          /*
          |--------------------------------------------------------------------------
          | Immediately add new report to page
          |--------------------------------------------------------------------------
          */

          setDatabaseReports(
            (
              previous
            ) => [
              created,
              ...previous,
            ]
          );

          setMyReports(
            (
              previous
            ) => [
              created,
              ...previous,
            ]
          );

          setIsModalOpen(
            false
          );

          resetForm();

          addToast(
            reportType ===
              "lost"
              ? "Lost pet report registered successfully!"
              : "Found pet report registered successfully!",
            "success"
          );
        } catch (error: any) {
          console.error(
            "Create report failed:",
            error
          );

          addToast(
            error?.response
              ?.data?.error ||
              "Failed to register the report.",
            "error"
          );
        } finally {
          setIsSubmitting(
            false
          );
        }
      };

    /*
    |--------------------------------------------------------------------------
    | RESOLVE REPORT
    |--------------------------------------------------------------------------
    */

    const handleResolve =
      async (
        report: LostFoundReport
      ) => {
        if (!requireAuth()) {
          return;
        }

        const confirmed =
          window.confirm(
            "Are you sure you want to mark this report as resolved?"
          );

        if (!confirmed) {
          return;
        }

        try {
          const updated =
            await lostFoundApi.resolveReport(
              report._id
            );

          setDatabaseReports(
            (
              previous
            ) =>
              previous.map(
                (
                  item
                ) =>
                  item._id ===
                  updated._id
                    ? updated
                    : item
              )
            );

          setMyReports(
            (
              previous
            ) =>
              previous.map(
                (
                  item
                ) =>
                  item._id ===
                  updated._id
                    ? updated
                    : item
              )
            );

          addToast(
            "Report marked as resolved.",
            "success"
          );
        } catch (error: any) {
          addToast(
            error?.response
              ?.data?.error ||
              "Failed to resolve report.",
            "error"
          );
        }
      };

    /*
    |--------------------------------------------------------------------------
    | DELETE REPORT
    |--------------------------------------------------------------------------
    */

    const handleDelete =
      async (
        report: LostFoundReport
      ) => {
        if (!requireAuth()) {
          return;
        }

        const confirmed =
          window.confirm(
            "Are you sure you want to permanently delete this report?"
          );

        if (!confirmed) {
          return;
        }

        try {
          await lostFoundApi.deleteReport(
            report._id
          );

          setDatabaseReports(
            (
              previous
            ) =>
              previous.filter(
                (
                  item
                ) =>
                  item._id !==
                  report._id
              )
          );

          setMyReports(
            (
              previous
            ) =>
              previous.filter(
                (
                  item
                ) =>
                  item._id !==
                  report._id
              )
          );

          addToast(
            "Report deleted successfully.",
            "success"
          );
        } catch (error: any) {
          addToast(
            error?.response
              ?.data?.error ||
              "Failed to delete report.",
            "error"
          );
        }
      };

    /*
    |--------------------------------------------------------------------------
    | DATABASE FILTER
    |--------------------------------------------------------------------------
    */

    const filteredDatabaseReports =
      useMemo(() => {
        if (
          activeTab ===
          "all"
        ) {
          return databaseReports;
        }

        return databaseReports.filter(
          (
            report
          ) =>
            report.type ===
            activeTab
        );
      }, [
        databaseReports,
        activeTab,
      ]);

    /*
    |--------------------------------------------------------------------------
    | SPLIT DATABASE REPORTS
    |--------------------------------------------------------------------------
    */

    const databaseLostReports =
      filteredDatabaseReports.filter(
        (
          report
        ) =>
          report.type ===
          "lost"
      );

    const databaseFoundReports =
      filteredDatabaseReports.filter(
        (
          report
        ) =>
          report.type ===
          "found"
      );

    /*
    |--------------------------------------------------------------------------
    | DISPLAY IMAGE
    |--------------------------------------------------------------------------
    */

    const getImage =
      (
        report:
          | LostFoundReport
          | FixedReport
      ) => {
        if (
          report.photoUrl
        ) {
          return report.photoUrl;
        }

        return PET_IMAGES[
          report.species
        ];
      };

    /*
    |--------------------------------------------------------------------------
    | REPORT CARD
    |--------------------------------------------------------------------------
    */

    const renderReportCard =
      (
        report:
          | LostFoundReport
          | FixedReport,
        isMine = false
      ) => {
        const isFixed =
          "isFixed" in
            report &&
          report.isFixed;

        const databaseReport =
          !isFixed
            ? (report as LostFoundReport)
            : null;

        return (
          <div
            key={
              report.id ||
              report._id
            }
            className="
              bg-white
              rounded-2xl
              border
              border-emerald-950/10
              overflow-hidden
              shadow-md
              hover:shadow-xl
              transition-all
              duration-200
            "
          >
            {/* IMAGE */}

            <div
              className="
                h-56
                bg-slate-100
                overflow-hidden
                relative
              "
            >
              <img
                src={getImage(
                  report
                )}
                alt={
                  report.petName ||
                  "Pet"
                }
                className="
                  w-full
                  h-full
                  object-cover
                "
                onError={(
                  event
                ) => {
                  const target =
                    event.currentTarget;

                  target.src =
                    PET_IMAGES[
                      report.species
                    ];
                }}
              />

              {/* TYPE */}

              <div
                className="
                  absolute
                  top-3
                  left-3
                "
              >
                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-black
                    uppercase
                    shadow
                    ${
                      report.type ===
                      "lost"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-800"
                    }
                  `}
                >
                  {report.type}
                </span>
              </div>

              {/* FIXED LABEL */}

              {isFixed && (
                <div
                  className="
                    absolute
                    top-3
                    right-3
                  "
                >
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      bg-white/90
                      text-slate-700
                      shadow
                    "
                  >
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* CONTENT */}

            <div
              className="
                p-5
                space-y-3
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div>
                  <h3
                    className="
                      text-xl
                      font-black
                      text-[#000f22]
                    "
                  >
                    {report.petName ||
                      "Unnamed Pet"}
                  </h3>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-emerald-800
                      capitalize
                    "
                  >
                    {report.species} •{" "}
                    {report.breed}
                  </p>
                </div>

                {databaseReport &&
                  databaseReport.status ===
                    "resolved" && (
                    <CheckCircle2
                      className="
                        w-6
                        h-6
                        text-emerald-600
                        shrink-0
                      "
                    />
                  )}
              </div>

              {/* LOCATION */}

              <div
                className="
                  flex
                  items-start
                  gap-2
                  text-sm
                  text-slate-600
                "
              >
                <MapPin
                  className="
                    w-4
                    h-4
                    text-emerald-700
                    mt-0.5
                    shrink-0
                  "
                />

                <span>
                  {report.lastLocation}
                </span>
              </div>

              {/* DATE */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-600
                "
              >
                <Calendar
                  className="
                    w-4
                    h-4
                    text-emerald-700
                    shrink-0
                  "
                />

                <span>
                  {report.type ===
                  "lost"
                    ? "Lost"
                    : "Found"}{" "}
                  on{" "}
                  {
                    report.reportedDate
                  }
                </span>
              </div>

              {/* DETAILS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  text-xs
                  pt-2
                "
              >
                <div
                  className="
                    bg-slate-50
                    rounded-lg
                    p-2
                  "
                >
                  <span className="text-slate-500">
                    Color
                  </span>

                  <p className="font-bold text-slate-800">
                    {report.color}
                  </p>
                </div>

                <div
                  className="
                    bg-slate-50
                    rounded-lg
                    p-2
                  "
                >
                  <span className="text-slate-500">
                    Eyes
                  </span>

                  <p className="font-bold text-slate-800">
                    {
                      report.eyeColor
                    }
                  </p>
                </div>
              </div>

              {/* CONTACT */}

              <div
                className="
                  border-t
                  border-slate-100
                  pt-3
                "
              >
                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Contact
                </p>

                <p
                  className="
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  {
                    report.contactName
                  }
                </p>

                <p
                  className="
                    text-sm
                    text-emerald-700
                    font-semibold
                  "
                >
                  {
                    report.contactPhone
                  }
                </p>
              </div>

              {/* MY REPORT CONTROLS */}

              {isMine &&
                databaseReport && (
                  <div
                    className="
                      flex
                      gap-2
                      pt-2
                    "
                  >
                    {databaseReport.status !==
                      "resolved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleResolve(
                            databaseReport
                          )
                        }
                        className="
                          flex-1
                          py-2
                          rounded-xl
                          bg-emerald-100
                          text-emerald-800
                          text-xs
                          font-bold
                          hover:bg-emerald-200
                        "
                      >
                        Mark Resolved
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          databaseReport
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-red-50
                        text-red-600
                        hover:bg-red-100
                      "
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
            </div>
          </div>
        );
      };

    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return (
      <div
        className="
          min-h-screen
          bg-emerald-50/20
          py-10
          px-4
          sm:px-6
          lg:px-8
          space-y-10
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            max-w-6xl
            mx-auto
            text-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              justify-center
              w-14
              h-14
              rounded-2xl
              bg-emerald-100
              mb-4
            "
          >
            <PawPrint
              className="
                w-7
                h-7
                text-emerald-700
              "
            />
          </div>

          <h1
            className="
              text-4xl
              sm:text-5xl
              font-black
              text-[#000f22]
            "
          >
            Lost & Found
          </h1>

          <p
            className="
              mt-3
              text-slate-600
              max-w-2xl
              mx-auto
            "
          >
            Help lost pets find their
            way home. Every registered
            report is stored permanently
            in the FurCare database.
          </p>
        </div>

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}

        <div
          className="
            max-w-6xl
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
          "
        >
          <button
            type="button"
            onClick={() =>
              openReportModal(
                "lost"
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-red-600
              text-white
              py-4
              px-6
              font-black
              shadow-lg
              hover:bg-red-700
              transition
            "
          >
            <Plus className="w-5 h-5" />

            Report Lost Pet
          </button>

          <button
            type="button"
            onClick={() =>
              openReportModal(
                "found"
              )
            }
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-emerald-600
              text-white
              py-4
              px-6
              font-black
              shadow-lg
              hover:bg-emerald-700
              transition
            "
          >
            <Plus className="w-5 h-5" />

            Report Found Pet
          </button>
        </div>

        {/* =====================================================
            DATABASE INFORMATION
        ===================================================== */}

        
        {/* =====================================================
            FILTER
        ===================================================== */}

        <div
          className="
            max-w-6xl
            mx-auto
            flex
            flex-wrap
            gap-2
          "
        >
          {(
            [
              "all",
              "lost",
              "found",
            ] as const
          ).map(
            (
              tab
            ) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab
                  )
                }
                className={`
                  px-5
                  py-2.5
                  rounded-full
                  text-sm
                  font-bold
                  capitalize
                  transition
                  ${
                    activeTab ===
                    tab
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
                  }
                `}
              >
                {tab ===
                "all"
                  ? "All Reports"
                  : `${tab} Pets`}
              </button>
            )
          )}
        </div>

        {/* =====================================================
            DATABASE REPORTS
        ===================================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-[#000f22]
                "
              >
                Registered Reports
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Live reports
               
              </p>
            </div>

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-emerald-100
                text-emerald-800
                text-sm
                font-black
              "
            >
              {
                filteredDatabaseReports.length
              }
            </span>
          </div>

          {isLoading ? (
            <div
              className="
                flex
                items-center
                justify-center
                py-16
              "
            >
              <Loader2
                className="
                  w-8
                  h-8
                  animate-spin
                  text-emerald-600
                "
              />
            </div>
          ) : filteredDatabaseReports.length ===
            0 ? (
            <div
              className="
                bg-white
                rounded-2xl
                border
                border-dashed
                border-slate-300
                py-14
                text-center
              "
            >
              <PawPrint
                className="
                  w-10
                  h-10
                  mx-auto
                  text-slate-300
                "
              />

              <p
                className="
                  mt-3
                  font-bold
                  text-slate-600
                "
              >
                No registered reports
                yet.
              </p>

              <p
                className="
                  text-sm
                  text-slate-400
                  mt-1
                "
              >
                Be the first person to
                register a report.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >
              {filteredDatabaseReports.map(
                (
                  report
                ) =>
                  renderReportCard(
                    report
                  )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            MY REPORTS
        ===================================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
          "
        >
          <div
            className="
              bg-white
              rounded-3xl
              border
              border-emerald-100
              p-6
              shadow-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                "
              >
                <User
                  className="
                    w-5
                    h-5
                    text-blue-700
                  "
                />
              </div>

              <div>
                <h2
                  className="
                    text-2xl
                    font-black
                    text-[#000f22]
                  "
                >
                  My Previous Reports
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Reports registered
                  from your account
                </p>
              </div>
            </div>

            {isLoadingMine ? (
              <div
                className="
                  flex
                  justify-center
                  py-10
                "
              >
                <Loader2
                  className="
                    w-7
                    h-7
                    animate-spin
                    text-emerald-600
                  "
                />
              </div>
            ) : myReports.length ===
              0 ? (
              <div
                className="
                  text-center
                  py-10
                  bg-slate-50
                  rounded-2xl
                "
              >
                <p
                  className="
                    font-bold
                    text-slate-600
                  "
                >
                  You have not registered
                  any reports yet.
                </p>
              </div>
            ) : (
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-6
                "
              >
                {myReports.map(
                  (
                    report
                  ) =>
                    renderReportCard(
                      report,
                      true
                    )
                )}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            FIXED LOST REPORTS
        ===================================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
          "
        >
          <div
            className="
              mb-5
            "
          >
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-[#000f22]
              "
            >
            Lost Pets
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Sample community reports
              displayed for demonstration.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >
            {FIXED_LOST_REPORTS.map(
              (
                report
              ) =>
                renderReportCard(
                  report
                )
            )}
          </div>
        </section>

        {/* =====================================================
            FIXED FOUND REPORTS
        ===================================================== */}

        <section
          className="
            max-w-6xl
            mx-auto
          "
        >
          <div
            className="
              mb-5
            "
          >
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-[#000f22]
              "
            >
            Found Pets
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >
              Sample found reports
              displayed for demonstration.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >
            {FIXED_FOUND_REPORTS.map(
              (
                report
              ) =>
                renderReportCard(
                  report
                )
            )}
          </div>
        </section>

        {/* =====================================================
            REPORT MODAL
        ===================================================== */}

        {isModalOpen && (
          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/50
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
          >
            <div
              className="
                w-full
                max-w-3xl
                max-h-[92vh]
                overflow-y-auto
                bg-white
                rounded-3xl
                shadow-2xl
              "
            >
              {/* MODAL HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-10
                  bg-white
                  border-b
                  border-slate-100
                  px-6
                  py-5
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <h2
                    className="
                      text-2xl
                      font-black
                      text-[#000f22]
                    "
                  >
                    {reportType ===
                    "lost"
                      ? "Report Lost Pet"
                      : "Report Found Pet"}
                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    Your report will be
                    permanently stored in
                    the database.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSubmitting
                  }
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    hover:bg-slate-200
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="
                  p-6
                  space-y-6
                "
              >
                {/* REPORT TYPE */}

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-bold
                      text-slate-700
                      mb-2
                    "
                  >
                    Report Type
                  </label>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setReportType(
                          "lost"
                        )
                      }
                      className={`
                        py-3
                        rounded-xl
                        font-bold
                        border-2
                        ${
                          reportType ===
                          "lost"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-slate-200 text-slate-600"
                        }
                      `}
                    >
                      Lost Pet
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setReportType(
                          "found"
                        )
                      }
                      className={`
                        py-3
                        rounded-xl
                        font-bold
                        border-2
                        ${
                          reportType ===
                          "found"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600"
                        }
                      `}
                    >
                      Found Pet
                    </button>
                  </div>
                </div>

                {/* IMAGE */}

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-bold
                      text-slate-700
                      mb-2
                    "
                  >
                    Pet Image *
                  </label>

                  <label
                    className="
                      block
                      cursor-pointer
                    "
                  >
                    <div
                      className="
                        border-2
                        border-dashed
                        border-emerald-300
                        rounded-2xl
                        overflow-hidden
                        bg-emerald-50/30
                      "
                    >
                      {imagePreview ? (
                        <div
                          className="
                            relative
                            h-64
                          "
                        >
                          <img
                            src={
                              imagePreview
                            }
                            alt="Pet preview"
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                          />

                          <div
                            className="
                              absolute
                              inset-0
                              bg-black/30
                              flex
                              items-center
                              justify-center
                              opacity-0
                              hover:opacity-100
                              transition
                            "
                          >
                            <span
                              className="
                                bg-white
                                px-4
                                py-2
                                rounded-xl
                                font-bold
                              "
                            >
                              Change Image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="
                            h-48
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            p-5
                          "
                        >
                          <Upload
                            className="
                              w-10
                              h-10
                              text-emerald-600
                              mb-3
                            "
                          />

                          <p
                            className="
                              font-bold
                              text-slate-700
                            "
                          >
                            Click to upload
                            pet image
                          </p>

                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                            "
                          >
                            JPG, PNG or WEBP
                            • Maximum 10 MB
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                {/* BASIC DETAILS */}

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-4
                  "
                >
                  {/* NAME */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Pet Name
                    </label>

                    <input
                      value={
                        petName
                      }
                      onChange={(
                        event
                      ) =>
                        setPetName(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Max"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />
                  </div>

                  {/* SPECIES */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Species *
                    </label>

                    <select
                      value={
                        species
                      }
                      onChange={(
                        event
                      ) =>
                        setSpecies(
                          event
                            .target
                            .value as Species
                        )
                      }
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                        bg-white
                      "
                    >
                      <option value="dog">
                        Dog
                      </option>

                      <option value="cat">
                        Cat
                      </option>

                      <option value="rabbit">
                        Rabbit
                      </option>
                    </select>
                  </div>

                  {/* BREED */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Breed *
                    </label>

                    <input
                      required
                      value={
                        breed
                      }
                      onChange={(
                        event
                      ) =>
                        setBreed(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Golden Retriever"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />
                  </div>

                  {/* COLOR */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Color *
                    </label>

                    <input
                      required
                      value={
                        color
                      }
                      onChange={(
                        event
                      ) =>
                        setColor(
                          event.target.value
                        )
                      }
                      placeholder="e.g. White and brown"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />
                  </div>

                  {/* EYE COLOR */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Eye Color *
                    </label>

                    <input
                      required
                      value={
                        eyeColor
                      }
                      onChange={(
                        event
                      ) =>
                        setEyeColor(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Brown"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />
                  </div>

                  {/* FACE */}

                  <div>
                    <label
                      className="
                        block
                        text-sm
                        font-bold
                        text-slate-700
                        mb-2
                      "
                    >
                      Face Structure *
                    </label>

                    <select
                      value={
                        faceStructure
                      }
                      onChange={(
                        event
                      ) =>
                        setFaceStructure(
                          event
                            .target
                            .value as FaceStructure
                        )
                      }
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                        bg-white
                      "
                    >
                      <option value="round">
                        Round
                      </option>

                      <option value="long">
                        Long
                      </option>

                      <option value="pointed">
                        Pointed
                      </option>

                      <option value="flat">
                        Flat
                      </option>
                    </select>
                  </div>
                </div>

                {/* EXTRA DETAILS */}

                <div>
                  <h3
                    className="
                      font-black
                      text-lg
                      text-[#000f22]
                      mb-4
                    "
                  >
                    Additional Pet Details
                  </h3>

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-4
                    "
                  >
                    <input
                      value={
                        collarNeckband
                      }
                      onChange={(
                        event
                      ) =>
                        setCollarNeckband(
                          event.target.value
                        )
                      }
                      placeholder="Collar / neckband"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />

                    <input
                      value={
                        lastWearCloth
                      }
                      onChange={(
                        event
                      ) =>
                        setLastWearCloth(
                          event.target.value
                        )
                      }
                      placeholder="Last worn clothing"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />

                    <textarea
                      value={
                        birthmarkOrFeature
                      }
                      onChange={(
                        event
                      ) =>
                        setBirthmarkOrFeature(
                          event.target.value
                        )
                      }
                      placeholder="Birthmark or distinctive feature"
                      rows={3}
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                        md:col-span-2
                      "
                    />
                  </div>
                </div>

                {/* LOCATION */}

                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-bold
                      text-slate-700
                      mb-2
                    "
                  >
                    Last Known Location *
                  </label>

                  <input
                    required
                    value={
                      lastLocation
                    }
                    onChange={(
                      event
                    ) =>
                      setLastLocation(
                        event.target.value
                      )
                    }
                    placeholder="e.g. GEC Circle, Chattogram"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      outline-none
                      focus:border-emerald-500
                    "
                  />
                </div>

                {/* CONTACT */}

                <div>
                  <h3
                    className="
                      font-black
                      text-lg
                      text-[#000f22]
                      mb-4
                    "
                  >
                    Contact Information
                  </h3>

                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      gap-4
                    "
                  >
                    <input
                      required
                      value={
                        contactName
                      }
                      onChange={(
                        event
                      ) =>
                        setContactName(
                          event.target.value
                        )
                      }
                      placeholder="Your name"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />

                    <input
                      required
                      value={
                        contactPhone
                      }
                      onChange={(
                        event
                      ) =>
                        setContactPhone(
                          event.target.value
                        )
                      }
                      placeholder="Phone number"
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        outline-none
                        focus:border-emerald-500
                      "
                    />
                  </div>
                </div>

                {/* SUBMIT */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    sm:flex-row
                    gap-3
                    pt-3
                  "
                >
                  <button
                    type="button"
                    onClick={
                      closeModal
                    }
                    disabled={
                      isSubmitting
                    }
                    className="
                      flex-1
                      py-3.5
                      rounded-xl
                      border
                      border-slate-200
                      text-slate-700
                      font-bold
                      hover:bg-slate-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                    className="
                      flex-1
                      py-3.5
                      rounded-xl
                      bg-emerald-600
                      text-white
                      font-black
                      hover:bg-emerald-700
                      disabled:opacity-60
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="
                            w-5
                            h-5
                            animate-spin
                          "
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />

                        Register Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

export default LostAndFoundPage;