import React, { useState } from 'react';

/**
 * Step 2: Lesson Preparation
 * Handles: Chapters with title, subtitle, intro, description, attachments
 * Exercises: radio, checkbox, text input with correct answers
 */
const Step2LessonPrep = ({ formData, setFormData, errors }) => {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(null);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: '',
    subtitle: '',
    description: '',
    intro_message: '',
    week_number: '',
    order_index: '',
    thumbnail: null,
    exercises: [],
    isNew: true,
  });

  const [newExercise, setNewExercise] = useState({
    question: '',
    type: 'radio',
    options: [],
    correct_answer: '',
    points: 1,
    isNew: true,
  });

  const handleAddChapter = () => {
    if (!newChapter.title.trim()) {
      alert('Please enter a chapter title');
      return;
    }

    const chapter = {
      ...newChapter,
      order_index: formData.chapters.length,
    };

    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, chapter]
    }));

    setNewChapter({
      title: '',
      subtitle: '',
      description: '',
      intro_message: '',
      week_number: '',
      order_index: '',
      thumbnail: null,
      exercises: [],
      isNew: true,
    });
    setShowChapterForm(false);
  };

  const handleRemoveChapter = (idx) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== idx)
    }));
    setSelectedChapterIdx(null);
  };

  const handleAddExercise = () => {
    if (!newExercise.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (newExercise.type !== 'text' && newExercise.options.length === 0) {
      alert('Please add at least one option');
      return;
    }

    if (selectedChapterIdx !== null) {
      setFormData(prev => {
        const updated = [...prev.chapters];
        updated[selectedChapterIdx].exercises = [
          ...(updated[selectedChapterIdx].exercises || []),
          { ...newExercise, order_index: updated[selectedChapterIdx].exercises?.length || 0 }
        ];
        return { ...prev, chapters: updated };
      });

      setNewExercise({
        question: '',
        type: 'radio',
        options: [],
        correct_answer: '',
        points: 1,
        isNew: true,
      });
    }
  };

  const handleRemoveExercise = (chapterIdx, exerciseIdx) => {
    setFormData(prev => {
      const updated = [...prev.chapters];
      updated[chapterIdx].exercises = updated[chapterIdx].exercises?.filter((_, i) => i !== exerciseIdx);
      return { ...prev, chapters: updated };
    });
  };

  const currentChapter = selectedChapterIdx !== null ? formData.chapters[selectedChapterIdx] : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Lesson Preparation</h2>
      <p className="text-xs sm:text-base text-gray-600">Create chapters and add exercises for each chapter</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chapters List */}
        <div className="col-span-1 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Chapters</h3>
          <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
            {formData.chapters.map((ch, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedChapterIdx(idx)}
                className={`p-2 sm:p-3 rounded-lg cursor-pointer transition ${
                  selectedChapterIdx === idx
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-xs sm:text-sm">{ch.title}</p>
                <p className="text-xs text-gray-600 mt-1">Week {ch.week_number || '-'}</p>
                <p className="text-xs text-gray-600">{ch.exercises?.length || 0} exercises</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowChapterForm(!showChapterForm)}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + Add Chapter
          </button>

          {selectedChapterIdx !== null && (
            <button
              onClick={() => handleRemoveChapter(selectedChapterIdx)}
              className="w-full py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
            >
              Remove Chapter
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-1 lg:col-span-2">
          {/* Add Chapter Form */}
          {showChapterForm && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 border border-gray-300">
              <h4 className="text-base sm:text-lg font-semibold mb-4">New Chapter</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">Chapter Title *</label>
                  <input
                    type="text"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg"
                    placeholder="e.g., Getting Started"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={newChapter.subtitle}
                    onChange={(e) => setNewChapter({ ...newChapter, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Introduction to the basics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Week Number</label>
                  <input
                    type="number"
                    value={newChapter.week_number}
                    onChange={(e) => setNewChapter({ ...newChapter, week_number: e.target.value })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Introduction/Rules</label>
                  <textarea
                    value={newChapter.intro_message}
                    onChange={(e) => setNewChapter({ ...newChapter, intro_message: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="What students should know before starting this chapter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newChapter.description}
                    onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Detailed chapter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Chapter Thumbnail</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewChapter({ ...newChapter, thumbnail: e.target.files?.[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddChapter}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Chapter
                  </button>
                  <button
                    onClick={() => setShowChapterForm(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chapter Details & Exercises */}
          {currentChapter && (
            <div>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-6">
                <h4 className="text-base sm:text-lg font-semibold mb-2">Week {currentChapter.week_number}: {currentChapter.title}</h4>
                <p className="text-xs sm:text-sm text-gray-700">{currentChapter.subtitle}</p>
              </div>

              <h4 className="text-base sm:text-lg font-semibold mb-4">Exercises</h4>

              {/* Exercises List */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {currentChapter.exercises?.map((ex, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-xs sm:text-sm">{ex.question}</p>
                        <p className="text-xs text-gray-600 mt-1">Type: {ex.type} | Points: {ex.points}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(selectedChapterIdx, idx)}
                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Exercise Form */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <h5 className="font-semibold mb-3">Add Exercise</h5>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question *</label>
                    <textarea
                      value={newExercise.question}
                      onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="What is the question?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type *</label>
                      <select
                        value={newExercise.type}
                        onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="radio">Multiple Choice</option>
                        <option value="checkbox">Multiple Select</option>
                        <option value="text">Text Input</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Points</label>
                      <input
                        type="number"
                        value={newExercise.points}
                        onChange={(e) => setNewExercise({ ...newExercise, points: e.target.value })}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {newExercise.type === 'text' ? (
                    <div>
                      <label className="block text-sm font-medium mb-1">Correct Answer</label>
                      <input
                        type="text"
                        value={newExercise.correct_answer}
                        onChange={(e) => setNewExercise({ ...newExercise, correct_answer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="The correct answer"
                      />
                    </div>
                  ) : (
                    <ExerciseOptionsInput
                      options={newExercise.options}
                      onChange={(options) => setNewExercise({ ...newExercise, options })}
                    />
                  )}

                  <button
                    onClick={handleAddExercise}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Exercise
                  </button>
                </div>
              </div>
            </div>
          )}

          {!currentChapter && !showChapterForm && (
            <div className="text-center py-12 text-gray-500">
              <p>Select a chapter or create a new one to add exercises</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Step 2 Information</h4>
        <p className="text-sm text-blue-800">
          Create chapters and add exercises. Exercises can be multiple choice, multiple select, or text input.
          Mark the correct answers for automated grading.
        </p>
      </div>
    </div>
  );
};

/**
 * Exercise Options Component for radio/checkbox questions
 */
const ExerciseOptionsInput = ({ options, onChange }) => {
  const addOption = () => {
    onChange([...options, { label: '', value: '', is_correct: false }]);
  };

  const updateOption = (idx, field, value) => {
    const updated = [...options];
    updated[idx][field] = value;
    onChange(updated);
  };

  const removeOption = (idx) => {
    onChange(options.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Options *</label>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <input
              type="text"
              value={opt.label}
              onChange={(e) => updateOption(idx, 'label', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={`Option ${idx + 1}`}
            />
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={opt.is_correct}
                onChange={(e) => updateOption(idx, 'is_correct', e.target.checked)}
              />
              <span className="text-sm">Correct</span>
            </label>
            <button
              onClick={() => removeOption(idx)}
              className="text-red-500 hover:text-red-700 px-2 py-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addOption}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        + Add Option
      </button>
    </div>
  );
};

export default Step2LessonPrep;
