// src/components/TagInput.jsx
import React, { useState, useRef, useEffect } from "react";

const TagInput = ({ tags = [], onTagsChange, isDark, suggestions = [] }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue.length > 0) {
      // ✅ Convert suggestions to strings if they are objects
      const suggestionStrings = suggestions.map((s) =>
        typeof s === "string" ? s : s.name,
      );

      const filtered = suggestionStrings.filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((t) => t.toLowerCase() === s.toLowerCase()),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.some((t) => t.toLowerCase() === trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const styles = {
    container: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      padding: "8px 12px",
      backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
      border: `1px solid ${isDark ? "#3d3d3d" : "#ced4da"}`,
      borderRadius: "6px",
      minHeight: "42px",
      alignItems: "center",
      cursor: "text",
      position: "relative",
    },
    tag: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 10px",
      backgroundColor: isDark ? "#0d6efd" : "#0d6efd",
      color: "#fff",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "default",
    },
    tagRemove: {
      cursor: "pointer",
      opacity: 0.7,
      fontSize: "12px",
      marginLeft: "4px",
      background: "none",
      border: "none",
      color: "#fff",
      padding: "0 2px",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      color: isDark ? "#e0e0e0" : "#212529",
      padding: "4px 0",
      minWidth: "80px",
      fontSize: "14px",
    },
    suggestions: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      marginTop: "4px",
      backgroundColor: isDark ? "#2d2d2d" : "#ffffff",
      border: `1px solid ${isDark ? "#3d3d3d" : "#ced4da"}`,
      borderRadius: "6px",
      maxHeight: "150px",
      overflowY: "auto",
      zIndex: 1000,
      listStyle: "none",
      padding: "4px 0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    suggestionItem: {
      padding: "6px 12px",
      cursor: "pointer",
      color: isDark ? "#e0e0e0" : "#212529",
      fontSize: "13px",
    },
  };

  return (
    <div style={styles.container} onClick={() => inputRef.current?.focus()}>
      {tags.map((tag, index) => (
        <span key={index} style={styles.tag}>
          #{tag}
          <button
            type="button"
            style={styles.tagRemove}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
        placeholder={tags.length === 0 ? "Add tags (press Enter)" : ""}
        style={styles.input}
      />
      {showSuggestions && (
        <ul style={styles.suggestions}>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              style={styles.suggestionItem}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? "#3d3d3d" : "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              #{suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
