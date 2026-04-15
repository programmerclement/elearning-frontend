import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

/**
 * CourseCard Component
 * Reusable course card with progress, chapters, and status
 */
export const CourseCard = ({
  course = {},
  progress = 0,
  status = 'not_started',
  onViewClick,
  onContinueClick,
}) => {
  const {
    id = '',
    title = 'Course Title',
    instructor_name = 'Instructor',
    thumbnail_url = '',
    total_chapters = 0,
    lessons_completed = 0,
    quiz_score = 0,
  } = course;

  const getStatusBadge = (status) => {
    const labels = {
      completed: { label: 'Completed', variant: 'success' },
      in_progress: { label: 'In Progress', variant: 'info' },
      locked: { label: 'Locked', variant: 'default' },
      not_started: { label: 'Not Started', variant: 'warning' },
    };
    return labels[status] || labels.not_started;
  };

  const badge = getStatusBadge(status);

  return (
    <Card variant="default" className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative mb-4 bg-gray-200 rounded-lg overflow-hidden h-32">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
        )}
        <div className="absolute top-2 right-2">
          <Badge label={badge.label} variant={badge.variant} size="sm" />
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">by {instructor_name}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Chapters</p>
          <p className="font-bold text-gray-800">{total_chapters}</p>
        </div>
        <div>
          <p className="text-gray-600">Lessons</p>
          <p className="font-bold text-gray-800">{lessons_completed}</p>
        </div>
        {quiz_score > 0 && (
          <div>
            <p className="text-gray-600">Score</p>
            <p className="font-bold text-gray-800">{Math.round(quiz_score)}%</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {status !== 'not_started' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-bold text-gray-800">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex gap-2">
        {onViewClick && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onViewClick}
            fullWidth
          >
            View
          </Button>
        )}
        {onContinueClick && status !== 'locked' && (
          <Button
            variant={status === 'completed' ? 'secondary' : 'primary'}
            size="sm"
            onClick={onContinueClick}
            fullWidth
          >
            {status === 'completed' ? 'Review' : 'Continue'}
          </Button>
        )}
      </div>
    </Card>
  );
};
