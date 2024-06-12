// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group. Now changed to an array.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(courseInfo, AssignmentGroup, learnerSubmissions) {
  try {
    // Iterate over each AssignmentGroup

    if (AssignmentGroup.course_id !== courseInfo.id) {
      throw new Error(
        `AssignmentGroup ${AssignmentGroup.id} does not belong to course ${courseInfo.id}`
      );
    }

    // Create a map of assignments for quick lookup
    const assignmentMap = {};

    AssignmentGroup.assignments.forEach((assignment) => {
      assignmentMap[assignment.id] = {
        ...assignment,
        group_weight: AssignmentGroup.group_weight,
      };
    });

    // Create a map of submissions by learner
    const learnerMap = {};
    learnerSubmissions.forEach((sub) => {
      const {
        learner_id,
        assignment_id,
        submission: { submitted_at, score },
      } = sub;
      if (!learnerMap[learner_id]) {
        learnerMap[learner_id] = {};
      }
      learnerMap[learner_id][sub.assignment_id] = { submitted_at, score };
    });

    // Process each learner's data
    const results = [];
    Object.keys(learnerMap).forEach((learnerid) => {
      const learnerData = { id: parseInt(learnerid), avg: 0 };
      let totalPoints = 0;
      let totalWeight = 0;

      Object.keys(learnerMap[learnerid]).forEach((assignmentid) => {
        const submission = learnerMap[learnerid][assignmentid];
        const assignment = assignmentMap[assignmentid];

        // Skip if assignment doesn't exist
        if (!assignment) return;

        const submittedDate = new Date(submission.submitted_at);
        const dueDate = new Date(assignment.due_at);

        // Skip if assignment is not yet due
        if (dueDate > new Date()) return;

        let actualScore = submission.score;

        // Late assignment deduct 10%
        if (submittedDate > dueDate) {
          actualScore = actualScore - assignment.points_possible * 0.1;
        }

        const percentage = actualScore / assignment.points_possible;
        learnerData[assignmentid] = percentage;

        totalPoints += assignment.points_possible * percentage;
        totalWeight += assignment.points_possible;
      });

      if (totalWeight > 0) {
        learnerData.avg = totalPoints / totalWeight; // Weighted average percentage
      }

      results.push(learnerData);
    });

    return results;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

// Call the function with the corrected parameters
console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
