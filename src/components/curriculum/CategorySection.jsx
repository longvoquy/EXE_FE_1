import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCourseNamesByGrade, courseImages } from '../../data/courseData';

// Helper function moved outside component
function getCourseNamesByGrade(grade, categoryType) {
  // Giả sử courses là một object chứa dữ liệu khóa học
  const allCourses = courses[grade] || [];

  if (categoryType === 'math') {
    return allCourses.filter(course =>
      course.toLowerCase().includes('số') ||
      course.toLowerCase().includes('toán') ||
      course.toLowerCase().includes('đếm') ||
      course.toLowerCase().includes('number')
    );
  } else if (categoryType === 'vietnamese') {
    return allCourses.filter(course =>
      !course.toLowerCase().includes('số') &&
      !course.toLowerCase().includes('toán') &&
      !course.toLowerCase().includes('đếm') &&
      !course.toLowerCase().includes('number')
    );
  }

  return allCourses;
}

export default function CategorySection({ title, active, categoryType }) {
  const navigate = useNavigate();
  const grades = ['Pre-K', 'K', '1', '2', '3', '4', '5'];
  const [selectedGrade, setSelectedGrade] = React.useState('Pre-K');

  const handleCourseClick = (lessonIndex, courseName) => {
    if (categoryType === 'math') {
      navigate(`/lesson-detail/numbers/lesson${lessonIndex + 1}`);
    } else if (categoryType === 'vietnamese') {
      navigate(`/lesson-detail/vietnamese/lesson${lessonIndex + 1}`);
    }
  };

  const currentCourseNames = getCourseNamesByGrade(selectedGrade, categoryType);

  return (
    <div
      className={`rounded-xl bg-[#3a3fa3] shadow p-6 min-h-[75vh] font-sans transition-all duration-500
        ${active ? 'scale-100 opacity-100' : 'scale-90 opacity-60 pointer-events-none'}`}
    >
      {/* Header */}
      <h2 className="font-extrabold text-2xl text-white tracking-wide mb-6">{title?.toUpperCase()}</h2>

      {/* Grade */}
      <div className="flex items-center gap-4 mb-8 pl-5">
        <span className="text-white text-lg font-semibold mr-1" style={{ minWidth: 70 }}>Lớp</span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all
              ${selectedGrade === grade
                ? 'bg-[#6ee7e7] text-[#23326d] shadow-lg'
                : 'bg-[#23277e] text-white hover:bg-[#4b50b7]'}
            `}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Danh sách khóa học */}
      <div className="grid grid-cols-4 gap-6">
        {currentCourseNames.map((course) => {
          const getDescription = () => course.description;
          const getIcon = () => course.tag === 'math' ? "🔢" : "📚"; // Sử dụng course.tag

          return (
            <div
              key={course._id} // Sử dụng _id thay vì index
              onClick={() => handleCourseClick(course.lessonId, course.title)} // Sử dụng lessonId từ dữ liệu
              className={`bg-[#302f5b] rounded-md text-white text-xs p-4 min-w-[220px] min-h-[220px] shadow-md hover:brightness-110 transition flex flex-col cursor-pointer relative ${course.tag === 'math' ? 'border-2 border-green-400' : 'border-2 border-purple-400'}`}
            >
              {/* Course Type Badge */}
              <div className="absolute top-2 right-2 text-lg">
                {getIcon()}
              </div>

              {courseImages[courseName] ? (
                <img
                  src={courseImages[courseName]}
                  alt={courseName}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              ) : (
                <div className={`w-full h-32 rounded mb-4 flex items-center justify-center text-4xl
                  ${categoryType === 'math' ? 'bg-gradient-to-br from-green-500 to-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}
                `}>
                  {getIcon()}
                </div>
              )}

              <div className="font-semibold text-base mb-2">{course.title}</div>
              <div className="text-xs">{getDescription()}</div>

              {/* Progress indicator */}
              <div className="mt-auto pt-2">
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full 
                      ${categoryType === 'math' ? 'bg-green-400' : 'bg-purple-400'}
                    `}
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {categoryType === 'math' ? '0/10 số' : '0/10 bài học'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CategorySection.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  categoryType: PropTypes.oneOf(['math', 'vietnamese']).isRequired // Giữ nguyên tên prop này
};

CategorySection.defaultProps = {
  title: '',
  active: false
};