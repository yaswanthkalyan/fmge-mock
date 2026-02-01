import { useNavigate } from "react-router-dom";

export default function Subjects() {
  const navigate = useNavigate();

  const subjects = [
    "Anatomy",
    "Physiology",
    "Biochemistry",
    "Pathology",
    "Microbiology",
    "Pharmacology",
    "Forensic Medicine",
    "Medicine & Allied (Psychiatry, Derm, Radio)",
    "General Surgery & Allied (Anaesthesia, Ortho)",
    "Community Medicine (PSM)",
    "Obstetrics & Gynaecology (OBG)",
    "Pediatrics",
    "Ophthalmology",
    "Otorhinolaryngology (ENT)"
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
              navigate(`/quiz?subject=${encodeURIComponent(subject)}`)
            }
            className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition text-left"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
}
