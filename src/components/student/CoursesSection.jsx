import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CourseCard } from './CourseCard';

/**
 * CoursesSection Component
 * Display courses with filtering by status
 */
export const CoursesSection = ({
  courses = [],
  isLoading = false,
  onCourseClick = () => {},
  onContinueClick = () => {},
  onEnrollClick = () => {},
}) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = ['all', 'in_progress', 'completed', 'not_started'];

  const filteredCourses = filter === 'all'
    ? courses
    : courses.filter(c => c.status === filter);

  const getFilterLabel = (f) => {
    const labels = {
      all: 'All Courses',
      in_progress: 'In Progress',
      completed: 'Completed',
      not_started: 'Not Started',
    };
    return labels[f] || 'All';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {getFilterLabel(option)}
              <span className="ml-2 text-xs">
                ({courses.filter(c => option === 'all' ? true : c.status === option).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'Explore and enroll in courses to get started!'
              : `No ${getFilterLabel(filter).toLowerCase()} courses.`}
          </p>
          {filter !== 'all' && (
            <Button variant="secondary" onClick={() => setFilter('all')}>
              View All Courses
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={course.progress_percentage || 0}
              status={course.status}
              onViewClick={() => onCourseClick(course.id)}
              onContinueClick={() => onContinueClick(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
