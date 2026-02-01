import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    { label: "Anatomy", value: "Anatomy" },
    { label: "Medicine & Allied (Psychiatry, Derm, Radio)", value: "MedicineAllied" },
    { label: "General Surgery & Allied (Anaesthesia, Ortho)", value: "SurgeryAllied" },
    { label: "Community Medicine (PSM)", value: "PSM" },
    { label: "Obstetrics & Gynaecology (OBG)", value: "OBG" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "Ophthalmology", value: "Ophthalmology" },
    { label: "Otorhinolaryngology (ENT)", value: "ENT" }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-8">
        Select Subject for Quiz
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subjects.map((subject, index) => (
          <button
            key={index}
            onClick={() =>
              navigate(`/quiz?subject=${subject.value}`)
            }
            className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition text-left"
          >
            {subject.label}
          </button>
        ))}
      </div>
    </div>
  );
}
