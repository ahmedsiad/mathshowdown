
const getRank = (rating) => {
    if (rating < 1200) return "Newbie";
    if (rating < 1500) return "Pupil";
    if (rating < 1800) return "Expert";
    if (rating < 2000) return "Candidate Master";
    if (rating < 2200) return "Master";
    return "Grandmaster";
}

export default getRank;