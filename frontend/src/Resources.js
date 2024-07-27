import React from 'react';
import './Resources.css';

const Resources = () => {
    const resources = [
        { title: "DIY Cat Enrichment", url: "https://www.aspca.org/pet-care/cat-care/feline-diy-enrichment" },
        { title: "General Cat Care", url: "https://www.aspca.org/pet-care/cat-care/general-cat-care" },
        { title: "Cat Grooming Tips", url: "https://www.aspca.org/pet-care/cat-care/cat-grooming-tips" },
        { title: "Cat Nutrition Tips", url: "https://www.aspca.org/pet-care/cat-care/cat-nutrition" },
        { title: "Common Cat Diseases", url: "https://www.aspca.org/pet-care/cat-care/common-cat-diseases" },
        { title: "Common Cat Behavior Issues", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues" },
        { title: "Vaccinations for Your Pet", url: "https://www.aspca.org/pet-care/general-pet-care/vaccinations-your-pet" }
    ];

    return (
        <div className="resources">
            <h2>Resources</h2>
            <ul>
                {resources.map((resource, index) => (
                    <li key={index}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Resources;



