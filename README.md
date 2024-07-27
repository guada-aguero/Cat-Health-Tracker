# Cat Health and Activity Tracker

## Project Outline

### Title
Cat Health and Activity Tracker: An Interactive Tool for Monitoring and Improving Cat Wellness

### Project Scope
Develop an interactive web-based application that helps cat owners track their cats' health, activity levels, and routines. The tool will provide insights into cat wellness, suggest activities and diets, schedule vaccinations and treatments, track grooming and dental care, and help optimize cat energy levels and sleep routines.

### Research Questions
1. What factors contribute to cat health and wellness?
2. How can cat owners improve their cats' activity levels and diets?
3. How do different feeding schedules (routine feeding vs. food always available) impact cat health?
4. What trends can be identified in cat health and activity over time?
5. How do grooming habits and routine care affect the overall wellness of cats?
6. How can feeding routines and activity levels be optimized to improve cats' energy levels and sleep patterns?

### Hypotheses
1. **Activity Impact Hypothesis**: Increased activity levels lead to improved cat health and wellness.
2. **Diet Improvement Hypothesis**: Optimized diets contribute to better health metrics in cats.
3. **Health Tracking Hypothesis**: Regular tracking of health metrics helps in early detection and prevention of health issues.
4. **Routine Care Hypothesis**: Regular vaccinations, anti-parasitic treatments, grooming, and dental care contribute to overall cat wellness.
5. **Sleep Optimization Hypothesis**: Proper feeding routines and activity levels help regulate cat energy levels and improve sleep patterns, aligning better with the owner's sleep schedule.

### Data Collection
Sources:
1. User-Contributed Data: Collect data from cat owners via online surveys and forms.
2. Example Data Points:
   - Daily Activity Levels
   - Diet and Nutrition Information
   - Health Metrics
   - Routine Care
   - Sleep Patterns
   - Awareness Questions

### Data Cleaning
1. Standardize Data Formats
2. Handle Missing Values
3. Verify Data Accuracy

### Data Analysis
1. Exploratory Data Analysis (EDA)
2. Comparative Analysis
3. Correlation Analysis
4. Hypothesis Testing

### Data Visualization with Tableau
1. Connect to Dataset
2. Create Dashboards

### Final Product

Interactive Web Application: based on the analysis and findings from the survey results, the Cat Health and Activity Tracker app can provide the following recommendations to cat owners:

1. **Promote Routine Feeding**:
   - Encourage routine feeding schedules to improve sleep quality and overall health. Highlight the significant difference in sleep quality between routine feeding and free feeding schedules.
2. **Increase Activity Levels**:
   - Suggest various activities to increase playtime and engagement, improving health and wellness. Emphasize the weak positive correlation between activity duration and sleep quality.
3. **Educate on Grooming and Health Care**:
   - Provide information on the importance of regular grooming, dental care, and other health measures. Highlight the moderate positive correlation between grooming frequency and sleep quality.
4. **Highlight Importance of Diverse Diets**:
   - Promote a variety of food types in routine feeding schedules for better nutrition. Emphasize the benefits of diverse diets compared to predominantly dry food in free feeding.
5. **Raise Awareness**:
   - Include educational content on the importance of teeth cleaning, shedding management, ear and eye care, playtime, and hairball prevention. Address the lack of awareness regarding these aspects among cat owners.
6. **Track and Monitor**:
   - Offer tools to track and monitor health metrics, activity levels, and routines to detect and prevent potential health issues early. Provide visualizations and alerts for upcoming vaccinations, treatments, and grooming schedules.

By implementing these features, the app can significantly enhance the well-being of cats and provide valuable support to cat owners.


1. **Frontend**:
   - Built with React.js.
   - Interactive user interface to input and visualize data.
2. **Backend**:
   - Built with Django and Django REST framework.
   - PostgreSQL database to store collected data.
3. **Features**:
   - Data Input: Forms for users to input data about their cats' health, activity, diet, and routines.
   - Recommendations: Provide personalized recommendations based on collected data.
   - Visualizations: Charts and graphs to track cat wellness metrics.
   - Notification Symbol: Alert symbol for unread recommendations.

##  Structure

Cat-Health-Tracker/
│
├── .gitignore
├── README.md
├── requirements.txt
├── secrets.env
│
├── notebooks/
│ ├── Analysis_Survey.ipynb
│ ├── Cleaning_Surveys.ipynb
│
├── data/
│ ├── cleaned_cat_survey_results.csv
│ ├── reshaped_data.csv
│ ├── survey_results_raw.csv
│
├── documents/
│ ├── Detailed Analysis and Interpretations.docx
│ ├── tableau-surveys.twbx
│
├── backend/
│ ├── manage.py
│ ├── media/
│ │ ├── photos/
│ │ ├── cat_photos/
│ │ ├── backg2.jpg
│ │ ├── other_uploaded_files/
│ ├── health/
│ │ ├── migrations/
│ │ │ └── init.py
│ │ ├── init.py
│ │ ├── admin.py
│ │ ├── apps.py
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── tests.py
│ │ ├── urls.py
│ │ ├── views.py
│ │ ├── utils.py
│ ├── backend/
│ │ ├── pycache/
│ │ ├── init.py
│ │ ├── asgi.py
│ │ ├── settings.py
│ │ ├── urls.py
│ │ ├── wsgi.py
│
├── frontend/
│ ├── public/
│ │ ├── index.html
│ │ ├── favicon.ico
│ ├── src/
│ │ ├── AddCatProfile.js
│ │ ├── AddHealthRecord.js
│ │ ├── api.js
│ │ ├── App.css
│ │ ├── App.js
│ │ ├── App.test.js
│ │ ├── background.jpg
│ │ ├── CatCalendar.js
│ │ ├── CatProfile.css
│ │ ├── CatProfile.js
│ │ ├── FeedingRecords.css
│ │ ├── FeedingRecords.js
│ │ ├── HairballRecords.css
│ │ ├── HairballRecords.js
│ │ ├── HealthRecords.css
│ │ ├── HealthRecords.js
│ │ ├── HealthTrends.css
│ │ ├── HealthTrends.js
│ │ ├── Home.css
│ │ ├── Home.js
│ │ ├── index.css
│ │ ├── index.js
│ │ ├── InteractionRecords.css
│ │ ├── InteractionRecords.js
│ │ ├── Login.css
│ │ ├── Login.js
│ │ ├── logo.svg
│ │ ├── Recommendations.css
│ │ ├── Recommendations.js
│ │ ├── Register.js
│ │ ├── reportWebVitals.js
│ │ ├── Resources.css
│ │ ├── Resources.js
│ │ ├── setupTests.js
│ │ ├── styles.css

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Cat-Health-Tracker.git
### Backend Setup
1. Create a virtual environment:
    ```bash
    python -m venv venv
    ```
2. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\\Scripts\\activate
        ```
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
3. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up the PostgreSQL database and update the `backend/settings.py` file with your database credentials:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': '<your_database_name>',
            'USER': '<your_database_user>',
            'PASSWORD': '<your_database_password>',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }
    ```

5. Run the migrations:
    ```bash
    python manage.py migrate
    ```

6. Start the development server:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup
1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the required Node.js packages:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

## Environment Variables
Create a `secrets.env` file in the root directory and add your environment variables. For example:
SECRET_KEY=<your_django_secret_key>
DEBUG=True
DATABASE_URL=postgres://<your_database_user>:<your_database_password>@localhost:5432/<your_database_name>

## Usage
- Access the web application via the browser.
- Input data related to cat health and activity.
- View interactive dashboards and receive recommendations.

## Future Enhancements
- Implement real-time notifications for upcoming events, vaccinations, and treatments.
- Expand metrics to include hydration levels, litter box usage, and behavioral patterns.
- Improve the user interface for better accessibility and mobile responsiveness.

## Contributing
Feel free to submit issues and pull requests.

## License
This project is an academic exercise and does not include a formal license.


## Acknowledgements
 - Special thanks to the Ironhack team for their support and guidance.
 - Thanks to the cat owners who contributed data for this project.