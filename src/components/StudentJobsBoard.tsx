import React, { useState, useMemo } from 'react';
import { JobPosition, UserStudentProfile } from '../types';
import { FEATURED_JOBS } from '../data/seed';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ArrowUpRight, 
  Flame, 
  PlusCircle, 
  Sparkles, 
  Check, 
  X, 
  Filter, 
  Layers, 
  SlidersHorizontal,
  Code2,
  ExternalLink,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/audio';
import { 
  doesTagMatchSkill, 
  getJobMatchingSkills, 
  POPULAR_TECH_SKILLS 
} from '../utils/skillMatcher';

interface StudentJobsBoardProps {
  jobs?: JobPosition[];
  userProfile?: UserStudentProfile;
  onUpdateSkills?: (skills: string[]) => void;
  onApplyForJob: (job: JobPosition) => void;
  onOpenPostRole: () => void;
  onOpenPassport?: () => void;
}

export const StudentJobsBoard: React.FC<StudentJobsBoardProps> = ({
  jobs = FEATURED_JOBS,
  userProfile,
  onUpdateSkills,
  onApplyForJob,
  onOpenPostRole,
  onOpenPassport,
}) => {
  // Primary job type filter
  const [filterType, setFilterType] = useState<'All' | 'Internship' | 'New Grad' | 'Entry-Level'>('All');
  
  // Selected technical skill filters (e.g. ['React', 'Go', 'Python'])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Quick toggle: filter roles matching candidate's entire profile tech stack
  const [filterByProfileOnly, setFilterByProfileOnly] = useState<boolean>(false);
  
  // Match mode when multiple skills are selected: 'any' (OR) vs 'all' (AND)
  const [matchMode, setMatchMode] = useState<'any' | 'all'>('any');

  // Search input for keyword or role
  const [searchQuery, setSearchQuery] = useState('');

  // Expand popular skills dropdown selector
  const [showAllTechSkills, setShowAllTechSkills] = useState(false);

  // New skill inline adder
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Candidate's saved tech skills from profile
  const candidateSkills = useMemo(() => {
    if (userProfile?.skills && userProfile.skills.length > 0) {
      return userProfile.skills;
    }
    return ['React', 'Go', 'Python', 'TypeScript'];
  }, [userProfile]);

  // Toggle single technical skill filter
  const handleToggleSkillFilter = (skill: string) => {
    playTactileClick();
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Add new skill directly to candidate's profile
  const handleAddSkillToProfile = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    
    // Check if duplicate (case-insensitive)
    if (!candidateSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...candidateSkills, trimmed];
      if (onUpdateSkills) {
        onUpdateSkills(updated);
      }
      playSuccessChime();
    }
    setNewSkillInput('');
    setIsAddingSkill(false);
  };

  // Remove skill from candidate's profile
  const handleRemoveSkillFromProfile = (skillToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTactileClick();
    const updated = candidateSkills.filter(s => s !== skillToRemove);
    if (onUpdateSkills) {
      onUpdateSkills(updated);
    }
    // Also remove from active filters if it was active
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Reset all filters
  const handleResetFilters = () => {
    playTactileClick();
    setFilterType('All');
    setSelectedSkills([]);
    setFilterByProfileOnly(false);
    setSearchQuery('');
  };

  // Filtered jobs memo with candidate skills matching engine
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Job Type
      if (filterType !== 'All' && job.type !== filterType) {
        return false;
      }

      // 2. Keyword query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 3. Fast filter by candidate's entire profile skills
      if (filterByProfileOnly) {
        const hasAnyProfileSkill = job.tags.some(tag => 
          candidateSkills.some(skill => doesTagMatchSkill(tag, skill))
        );
        if (!hasAnyProfileSkill) return false;
      }

      // 4. Specific selected technical skills filter (e.g. React, Go, Python)
      if (selectedSkills.length > 0) {
        if (matchMode === 'any') {
          const hasAnySelected = job.tags.some(tag => 
            selectedSkills.some(skill => doesTagMatchSkill(tag, skill))
          );
          if (!hasAnySelected) return false;
        } else {
          // 'all': Every selected skill must be present in job tags
          const hasAllSelected = selectedSkills.every(skill =>
            job.tags.some(tag => doesTagMatchSkill(tag, skill))
          );
          if (!hasAllSelected) return false;
        }
      }

      return true;
    });
  }, [jobs, filterType, searchQuery, filterByProfileOnly, selectedSkills, matchMode, candidateSkills]);

  // Count how many total jobs match any candidate profile skill
  const totalProfileSkillMatches = useMemo(() => {
    return jobs.filter(job => 
      job.tags.some(tag => candidateSkills.some(skill => doesTagMatchSkill(tag, skill)))
    ).length;
  }, [jobs, candidateSkills]);

  return (
    <section id="jobs" className="py-24 border-b border-[#E2E8F0] relative bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono tracking-widest text-[#1E3A8A] uppercase mb-3 flex items-center gap-2 font-bold">
              <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Curated 2027 Asian Positions // High Referral Urgency</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0A2540] mb-4">
              Featured Internships & New Grad Roles
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              Filter roles tailored directly to your candidate profile's technical skills (e.g., <strong className="text-[#1E3A8A]">React, Go, Python</strong>). Every position has verified internal referees standing by with fast turnaround vouches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Post a Role Button */}
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onOpenPostRole();
              }}
              className="px-4 py-2.5 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1E3A8A] rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Post a Role (+250 Karma)</span>
            </button>
          </div>
        </div>

        {/* CANDIDATE PROFILE SKILLS FILTERING SYSTEM BAR */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm relative overflow-hidden">
          
          {/* Profile Skills Banner Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E3A8A]">
                <Code2 className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#0A2540] text-sm">
                    Candidate Skill Filter System
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white text-[#1E3A8A] border border-[#BFDBFE] font-medium">
                    Profile: {userProfile?.handle || '@aditya_sys'}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 font-mono">
                  Filter roles matching your profile tech stack. <span className="text-[#1E3A8A] font-semibold">{totalProfileSkillMatches} roles</span> match your skills.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setFilterByProfileOnly(prev => !prev);
                  if (!filterByProfileOnly) setSelectedSkills([]);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  filterByProfileOnly 
                    ? 'bg-[#1E3A8A] text-white font-bold shadow-xs' 
                    : 'bg-white text-[#334155] hover:text-[#0F172A] border border-[#CBD5E1]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Match All Profile Skills ({totalProfileSkillMatches})</span>
              </button>

              {(selectedSkills.length > 0 || filterByProfileOnly) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#0F172A] hover:bg-white border border-[#E2E8F0] transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Skills Selector Row */}
          <div className="pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#64748B] mr-1">Your Skills:</span>
              
              {candidateSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkillFilter(skill)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 group ${
                      isSelected
                        ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                        : 'bg-white text-[#334155] hover:text-[#1E3A8A] border border-[#CBD5E1] hover:border-[#1E3A8A]'
                    }`}
                  >
                    <span>{skill}</span>
                    <span 
                      onClick={(e) => handleRemoveSkillFromProfile(skill, e)}
                      className="opacity-50 hover:opacity-100 hover:text-rose-500 transition-opacity ml-1"
                      title="Remove skill from profile"
                    >
                      ×
                    </span>
                  </button>
                );
              })}

              {/* Inline add skill button */}
              {isAddingSkill ? (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#1E3A8A]">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSkillToProfile(newSkillInput);
                      if (e.key === 'Escape') setIsAddingSkill(false);
                    }}
                    placeholder="e.g. C++, Java, Rust..."
                    className="w-32 bg-transparent text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkillToProfile(newSkillInput)}
                    className="p-0.5 text-[#1E3A8A] hover:text-[#1D4ED8]"
                    title="Add skill to profile"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSkill(false)}
                    className="p-0.5 text-[#64748B] hover:text-[#0F172A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setIsAddingSkill(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#64748B] hover:text-[#1E3A8A] bg-white hover:bg-[#F8FAFC] border border-dashed border-[#CBD5E1] hover:border-[#1E3A8A] transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <PlusCircle className="w-3 h-3 text-[#2563EB]" />
                  <span>+ Add Skill</span>
                </button>
              )}

              {/* Show more popular tech skills toggle */}
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setShowAllTechSkills(prev => !prev);
                }}
                className="px-2 py-1.5 rounded-xl text-[11px] font-mono text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                <span>{showAllTechSkills ? 'Fewer' : 'More skills'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllTechSkills ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable popular skills selector */}
            {showAllTechSkills && (
              <div className="pt-3 mt-3 border-t border-[#E2E8F0]">
                <div className="text-[11px] font-mono text-[#64748B] mb-2 font-medium">
                  Click a skill to add it to your candidate profile:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TECH_SKILLS.filter(s => !candidateSkills.includes(s)).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkillToProfile(skill)}
                      className="px-2 py-1 rounded-lg text-[11px] font-mono bg-white hover:bg-[#EFF6FF] text-[#475569] hover:text-[#1E3A8A] border border-[#CBD5E1] hover:border-[#93C5FD] transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <PlusCircle className="w-2.5 h-2.5 text-[#2563EB]" />
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Filter Row: Role Type & Search */}
          <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Role Type Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-[#CBD5E1] text-xs">
              {(['All', 'Internship', 'New Grad', 'Entry-Level'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    setFilterType(t);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                    filterType === t
                      ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, company, tag..."
                className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A] font-sans"
              />
              <Filter className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between mb-4 px-1 text-xs font-mono text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#0F172A] font-semibold">{filteredJobs.length}</strong> of {jobs.length} verified roles
            </span>
            {(selectedSkills.length > 0 || filterByProfileOnly) && (
              <span className="text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] font-medium">
                Filtered by skill: {filterByProfileOnly ? 'All Profile Skills' : selectedSkills.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const { matchingTags, matchedUserSkills, matchCount } = getJobMatchingSkills(
                job.tags,
                candidateSkills
              );

              const hasProfileMatch = matchCount > 0;

              return (
                <div
                  key={job.id}
                  className={`p-6 rounded-3xl bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 border group relative overflow-hidden shadow-sm hover:shadow-md ${
                    hasProfileMatch 
                      ? 'border-[#93C5FD] hover:border-[#1E3A8A]' 
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-2 relative z-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Company Name */}
                      <span className="font-bold text-[#1E3A8A] px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] font-display">
                        {job.company}
                      </span>

                      {/* Job Type */}
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                        {job.type}
                      </span>

                      {/* Urgent Badge */}
                      {job.urgent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-medium">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>Filling Fast</span>
                        </span>
                      )}

                      {/* Candidate Profile Skills Match Tag */}
                      {hasProfileMatch && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3 text-[#2563EB]" />
                          <span>
                            {matchCount} Profile {matchCount === 1 ? 'Skill' : 'Skills'} Matched ({matchedUserSkills.join(', ')})
                          </span>
                        </span>
                      )}

                      {/* Posted By */}
                      {job.postedBy && (
                        <span className="text-[10px] font-mono text-[#64748B]">
                          Posted by: {job.postedBy}
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h4 className="text-lg sm:text-xl font-bold font-display text-[#0A2540] group-hover:text-[#1E3A8A] transition-colors">
                      {job.title}
                    </h4>

                    {/* Job Details Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#1E3A8A] font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>{job.salaryRange}</span>
                      </span>
                      <span className="text-[#0F172A] font-medium">
                        {job.referralBonus}
                      </span>
                      <span className="text-[#64748B]">
                        +{job.refereeKarmaReward} Referee Karma
                      </span>
                    </div>

                    {/* Technical Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.tags.map((tag, i) => {
                        const isMatchedWithProfile = matchingTags.includes(tag);
                        const isExplicitlyFiltered = selectedSkills.some(s => doesTagMatchSkill(tag, s));

                        return (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 ${
                              isExplicitlyFiltered
                                ? 'bg-[#1E3A8A] text-white font-bold border border-[#1E3A8A] shadow-2xs'
                                : isMatchedWithProfile
                                ? 'bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] font-semibold'
                                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                            }`}
                          >
                            {(isExplicitlyFiltered || isMatchedWithProfile) && (
                              <Check className="w-2.5 h-2.5 stroke-[3] text-current" />
                            )}
                            <span>#{tag}</span>
                            {isMatchedWithProfile && !isExplicitlyFiltered && (
                              <span className="text-[9px] opacity-80 font-sans">(Skill Match)</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button - Dark Blue */}
                  <div className="flex items-center gap-3 shrink-0 relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        onApplyForJob(job);
                      }}
                      className="px-5 py-3 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-2xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-[#1E3A8A]/20"
                    >
                      <span>Request Employee Referral</span>
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="p-12 rounded-3xl bg-[#F8FAFC] border border-[#CBD5E1] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] mx-auto flex items-center justify-center text-[#64748B] shadow-2xs">
              <Layers className="w-6 h-6 text-[#1E3A8A]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#0A2540] text-lg">No roles found matching current skill criteria</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 font-mono">
                {selectedSkills.length > 0 
                  ? `None of our current verified positions match: ${selectedSkills.join(', ')}. Try selecting other skills from your profile or resetting the filter.`
                  : 'Try clearing your search or role type filter to see all positions.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-display font-bold text-xs transition-all shadow-sm"
              >
                Clear All Skill Filters
              </button>
              {onOpenPassport && (
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onOpenPassport();
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] text-xs transition-all shadow-2xs"
                >
                  Edit Profile Tech Stack
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
