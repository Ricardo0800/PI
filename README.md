# 🎮 ET Education - Learn Through Gaming

## Project Overview

**ET Education** is an innovative educational platform that revolutionizes how students learn **Mathematics** and **Computer Science** by integrating **Minecraft** as the primary teaching methodology. This project combines game-based learning with solid pedagogical principles to create an engaging learning experience for high school students.

### 👥 Development Team
- **Ricardo Guilherme** (3A)
- **Ariel Kevenn** (3A)  
- **Miguel** (3A)
- **Lucas** (3B)
- **Year**: 2024

---

## 🎯 Mission & Vision

### Mission
To make STEM education more engaging and accessible by leveraging Minecraft as an interactive learning tool, demonstrating complex mathematical and computational concepts through practical, hands-on experiences.

### Vision
Create a comprehensive learning ecosystem where students can:
- Learn through play and experimentation
- Apply theoretical knowledge to real-world Minecraft projects
- Track their progress and achievement
- Access curated educational materials
- Collaborate with peers in an interactive environment

---

## ✨ Key Features

### 📚 **Course Library** (`Biblioteca`)
- Structured courses combining video lessons with practical Minecraft projects
- Real-world problem solving through game mechanics
- Progressive difficulty levels from beginner to advanced
- Integration of mathematical concepts (geometry, algebra, logic) within gameplay

### 📖 **Study Materials** (`Materiais`)
- Downloadable PDFs and guides
- Supplementary resources for deeper understanding
- Practical worksheets and challenges
- Links to external educational content

### 📊 **Progress Tracking**
- Real-time learning analytics
- Student performance metrics
- Achievement system with milestones
- Visual representation of progress data

### 👤 **User Authentication**
- Email/password login system
- Google OAuth integration
- Secure session management via Supabase
- User profile management

### 🛠️ **Admin Dashboard**
- Course management (create, edit, delete)
- Video content management
- Study materials administration
- User analytics and monitoring
- Content organization and categorization

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **HTML5** - Semantic markup and structure
- **CSS3** - Responsive styling (81.1% of codebase)
- **JavaScript** - Interactive functionality (18.9% of codebase)
- **Bulma CSS** - Admin panel styling
- **Font Awesome** - Icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service (PostgreSQL)
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Real-time Databases**:
  - `Users` - User account data
  - `courses` - Course information
  - `videos` - Video content library
  - `Materiais` (Materials) - Study resources

### **Deployment**
- **Live**: https://pi-ebon.vercel.app
- **Hosting**: Vercel
- **Repository**: GitHub (Ricardo0800/PI)

---

## 📁 Project Structure

```
PI/
├── index.html                    # Landing page & main entry point
├── teste.html                    # Admin panel for course/video management
├── separadas.js                  # Supabase API integration & CRUD operations
├── frontend/
│   ├── pages/
│   │   ├── biblioteca.html       # Course library page
│   │   ├── materiais.html        # Study materials page
│   │   ├── quemSomos.html        # About project page
│   │   └── cadastro.html         # User registration
│   ├── assets/
│   │   └── img/
│   │       └── favSvg.svg        # Project mascot/logo
│   └── supabaseConfig.js         # Supabase initialization
├── admin/                        # Administrative pages
│   ├── admin.html                # Dashboard
│   ├── user_admin.html           # User management
│   ├── cursos_admin.html         # Course management
│   └── materiais_adm.html        # Materials management
├── BackEnd/                      # Backend services (Node.js)
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Minecraft Java Edition (for course participation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ricardo0800/PI.git
   cd PI
   ```

2. **Open the project**
   - Local: Open `index.html` in your browser
   - Online: Visit https://pi-ebon.vercel.app

3. **Environment Setup** (for development)
   - Create a `.env` file with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

---

## 📝 Usage Guide

### For Students

1. **Create an Account**
   - Click "Entrar" (Login) → "Criar conta" (Create Account)
   - Or use Google authentication for faster signup

2. **Browse Courses**
   - Navigate to "Biblioteca" (Library)
   - Select a course based on your level
   - Watch video lessons
   - Complete Minecraft challenges

3. **Access Materials**
   - Visit "Materiais" (Materials)
   - Download PDFs and guides
   - Reference resources while practicing

4. **Track Progress**
   - View your statistics in the dashboard
   - Monitor completed courses
   - Earn achievements and badges

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin/admin.html`
   - Authenticate with admin credentials

2. **Manage Courses**
   - Create new courses with descriptions
   - Link courses to video playlists
   - Set initial videos for courses
   - Edit or delete courses as needed

3. **Manage Videos**
   - Upload/link educational videos
   - Organize videos into courses
   - Track videos without course assignments
   - Edit video metadata

4. **Manage Materials**
   - Add study resources (PDFs, links)
   - Update material information
   - Delete outdated resources

---

## 🎮 Learning Approach: Minecraft as Pedagogy

### How Minecraft Enhances Learning

#### **Mathematics**
- **Geometry**: Building structures teaches spatial reasoning, angles, and proportions
- **Algebra**: Resource management involves equations and problem-solving
- **Statistics**: Tracking crops, ores, and resources teaches data analysis
- **Coordinate Systems**: Navigation teaches 3D coordinate geometry

#### **Computer Science**
- **Logic**: Redstone circuits teach Boolean logic and circuits
- **Programming Concepts**: Command blocks introduce procedural thinking
- **Data Structures**: Inventory systems teach organization and storage
- **Networking**: Multiplayer servers teach network concepts

### Course Examples

1. **"Building Bridges: Geometry Fundamentals"**
   - Construct bridges over varying heights
   - Calculate angles and load-bearing capacity
   - Apply trigonometry to real structures

2. **"Farm Automation: Logic & Circuits"**
   - Design automated farms using Redstone
   - Understand logic gates and signal processing
   - Optimize resource production

3. **"Pixel Art Mathematics"**
   - Create pixel art using coordinate systems
   - Study symmetry and transformations
   - Understand resolution and scaling

---

## 🔐 Security Features

- **Authentication**: Secure password hashing via Supabase Auth
- **Authorization**: Role-based access control (Student/Admin)
- **Data Privacy**: HTTPS encryption for all communications
- **Session Management**: JWT tokens with automatic expiration
- **Input Validation**: Form validation on both client and server

⚠️ **Security Note**: Database credentials are managed through Supabase's secure environment. Never commit sensitive keys to version control.

---

## 🌐 API Endpoints (Supabase)

### Authentication
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token` - Email login
- `POST /auth/v1/user` - Get current user
- `POST /auth/v1/logout` - Logout

### Courses (CRUD)
```javascript
// Create
supabase.from('courses').insert([{ nome, descricao }])

// Read
supabase.from('courses').select('*')

// Update
supabase.from('courses').update({ nome, descricao }).eq('id', courseId)

// Delete
supabase.from('courses').delete().eq('id', courseId)
```

### Videos (CRUD)
```javascript
// Create
supabase.from('videos').insert([{ titulo, url, descricao, curso_id }])

// Read
supabase.from('videos').select('*')

// Update
supabase.from('videos').update({ titulo, url, descricao }).eq('id', videoId)

// Delete
supabase.from('videos').delete().eq('id', videoId)
```

### Materials (CRUD)
```javascript
// Create
supabase.from('Materiais').insert({ nome, link })

// Read
supabase.from('Materiais').select('*')

// Update
supabase.from('Materiais').update({ nome, link }).eq('id', materialId)

// Delete
supabase.from('Materiais').delete().eq('id', materialId)
```

---

## 🛣️ Roadmap & Future Enhancements

### Phase 2 (Q3 2026)
- [ ] Interactive Minecraft mods for specialized learning
- [ ] Multiplayer collaborative learning sessions
- [ ] AI-powered course recommendations
- [ ] Mobile app for course access

### Phase 3 (Q4 2026)
- [ ] Gamification: Leaderboards and achievements
- [ ] Teacher classroom management tools
- [ ] Virtual classroom integration
- [ ] Certification system

### Phase 4 (2027)
- [ ] Support for other games (Minecraft Bedrock, educational platforms)
- [ ] International language support
- [ ] Advanced analytics and reporting
- [ ] API for third-party integrations

---

## 📊 Learning Outcomes

Students using ET Education will:

✅ Understand mathematical concepts through practical application  
✅ Develop problem-solving and critical thinking skills  
✅ Learn basic computer science and programming logic  
✅ Build confidence with STEM subjects  
✅ Collaborate with peers in virtual environments  
✅ Apply knowledge to real-world scenarios  
✅ Develop digital literacy skills  

---

## 🤝 Contributing

This is an educational project created as an integrated project for the Federal Institute of Brasília. Contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design for mobile

---

## 📄 License

This project is open source and available under the MIT License. See the LICENSE file for details.

---

## 📧 Contact & Support

- **Project Repository**: https://github.com/Ricardo0800/PI
- **Live Demo**: https://pi-ebon.vercel.app
- **School**: Instituto Federal de Brasília
- **Year**: 2024

---

## 🙏 Acknowledgments

- **Teachers & Mentors** at Instituto Federal de Brasília for guidance and support
- **Supabase** for providing free backend infrastructure
- **Tailwind CSS** for the component library
- **Minecraft Education Edition** for inspiring innovative pedagogy
- **Open Source Community** for amazing tools and libraries

---

## 📚 References & Resources

### Educational Frameworks
- [Minecraft Education Edition](https://education.minecraft.net/)
- [STEM Learning Through Games](https://www.gamesforchange.org/)

### Technologies Used
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Bulma Framework](https://bulma.io/)

### Pedagogical Inspiration
- Constructionist Learning (Seymour Papert)
- Game-Based Learning Research
- Situated Learning Theory

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Active Development

---

## 🎓 About Educational Innovation

ET Education represents a paradigm shift in STEM education. By leveraging the immersive nature of Minecraft, this platform demonstrates that engaging, practical learning experiences are not only possible but essential for modern education.

Our vision is to empower educators and students worldwide to see gaming not as a distraction from learning, but as a powerful tool FOR learning.

*"The best way to predict the future is to invent it." - Alan Kay*

---

**Made with ❤️ by Ricardo Guilherme, Ariel Kevenn, Miguel, and Lucas**

---

## 📝 Documentation Validation

✅ **Validated**: A comprehensive technical documentation of this project (v2_Jogos_Educacionais.md) has been verified against this README and all project specifications are 100% aligned.

**Documented by**: **Ricardo Félix Guedes Silva Nonato**  
**Date**: June 10, 2026  
**Role**: Project Documentation and Validation

---
