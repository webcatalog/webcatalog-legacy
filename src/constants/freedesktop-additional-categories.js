/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// https://specifications.freedesktop.org/menu-spec/latest/apas02.html
// if relatedMainCategories are specified,
// the additional category must be used the specified main categories
const freedesktopAdditionalCategories = [
  {
    name: 'Building',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'Debugger',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'IDE',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'GUIDesigner',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'Profiling',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'RevisionControl',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'Translation',
    relatedMainCategories: ['Development'],
  },
  {
    name: 'Calendar',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'ContactManagement',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'Database',
    relatedMainCategories: [
      'Office',
      'Development',
      'AudioVideo',
    ],
  },
  {
    name: 'Dictionary',
    relatedMainCategories: [
      'Office',
      'TextTools',
    ],
  },
  {
    name: 'Chart',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'Email',
    relatedMainCategories: [
      'Office',
      'Network',
    ],
  },
  {
    name: 'Finance',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'FlowChart',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'PDA',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'ProjectManagement',
    relatedMainCategories: [
      'Office',
      'Development',
    ],
  },
  {
    name: 'Presentation',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'Spreadsheet',
    relatedMainCategories: ['Office'],
  },
  {
    name: 'WordProcessor',
    relatedMainCategories: ['Office'],
  },
  {
    name: '2DGraphics',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: '2DGraphics;VectorGraphics',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: '2DGraphics;RasterGraphics',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: '3DGraphics',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: 'Scanning',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: 'Scanning;OCR',
    relatedMainCategories: ['Graphics'],
  },
  {
    name: 'Photography',
    relatedMainCategories: [
      'Graphics',
      'Office',
    ],
  },
  {
    name: 'Publishing',
    relatedMainCategories: [
      'Graphics',
      'Office',
    ],
  },
  {
    name: 'Viewer',
    relatedMainCategories: [
      'Graphics',
      'Office',
    ],
  },
  {
    name: 'TextTools',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'DesktopSettings',
    relatedMainCategories: ['Settings'],
  },
  {
    name: 'HardwareSettings',
    relatedMainCategories: ['Settings'],
  },
  {
    name: 'HardwareSettings;Printing',
    relatedMainCategories: ['Settings'],
  },
  {
    name: 'PackageManager',
    relatedMainCategories: ['Settings'],
  },
  {
    name: 'Dialup',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'InstantMessaging',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'Chat',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'IRCClient',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'Feed',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'FileTransfer',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'HamRadio',
    relatedMainCategories: [
      'Network',
      'Audio',
    ],
  },
  {
    name: 'News',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'P2P',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'RemoteAccess',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'Telephony',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'TelephonyTools',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'VideoConference',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'WebBrowser',
    relatedMainCategories: ['Network'],
  },
  {
    name: 'WebDevelopment',
    relatedMainCategories: [
      'Network',
      'Development',
    ],
  },
  {
    name: 'Midi',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
    ],
  },
  {
    name: 'Mixer',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
    ],
  },
  {
    name: 'Sequencer',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
    ],
  },
  {
    name: 'Tuner',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
    ],
  },
  {
    name: 'TV',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Video',
    ],
  },
  {
    name: 'AudioVideoEditing',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
      'AudioVideo;Video',
    ],
  },
  {
    name: 'Player',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
      'AudioVideo;Video',
    ],
  },
  {
    name: 'Recorder',
    relatedMainCategories: [
      'AudioVideo',
      'AudioVideo;Audio',
      'AudioVideo;Video',
    ],
  },
  {
    name: 'DiscBurning',
    relatedMainCategories: ['AudioVideo'],
  },
  {
    name: 'ActionGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'AdventureGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'ArcadeGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'BoardGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'BlocksGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'CardGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'KidsGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'LogicGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'RolePlaying',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'Shooter',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'Simulation',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'SportsGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'StrategyGame',
    relatedMainCategories: ['Game'],
  },
  {
    name: 'Art',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Construction',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Music',
    relatedMainCategories: [
      'AudioVideo',
      'Education',
    ],
  },
  {
    name: 'Languages',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'ArtificialIntelligence',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Astronomy',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Biology',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Chemistry',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'ComputerScience',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'DataVisualization',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Economy',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Electricity',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Geography',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Geology',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Geoscience',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'History',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Humanities',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'ImageProcessing',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Literature',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Maps',
    relatedMainCategories: [
      'Education',
      'Science',
      'Utility',
    ],
  },
  {
    name: 'Math',
    relatedMainCategories: [
      'Education',
      'Science',
      'Utility',
    ],
  },
  {
    name: 'Math;NumericalAnalysis',
    relatedMainCategories: [
      'Education',
      'Science',
      'Utility',
    ],
  },
  {
    name: 'MedicalSoftware',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Physics',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Robotics',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Spirituality',
    relatedMainCategories: [
      'Education',
      'Science',
      'Utility',
    ],
  },
  {
    name: 'Sports',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'ComputerScience;ParallelComputing',
    relatedMainCategories: [
      'Education',
      'Science',
    ],
  },
  {
    name: 'Amusement',
  },
  {
    name: 'Archiving',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'Archiving;Compression',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'Electronics',
  },
  {
    name: 'Emulator',
    relatedMainCategories: [
      'System',
      'Game',
    ],
  },
  {
    name: 'Engineering',
  },
  {
    name: 'FileTools',
    relatedMainCategories: [
      'Utility',
      'System',
    ],
  },
  {
    name: 'FileTools;FileManager',
    relatedMainCategories: ['System'],
  },
  {
    name: 'TerminalEmulator',
    relatedMainCategories: ['System'],
  },
  {
    name: 'Filesystem',
    relatedMainCategories: ['System'],
  },
  {
    name: 'Monitor',
    relatedMainCategories: [
      'System',
      'Network',
    ],
  },
  {
    name: 'Security',
    relatedMainCategories: [
      'Settings',
      'System',
    ],
  },
  {
    name: 'Accessibility',
    relatedMainCategories: [
      'Settings',
      'Utility',
    ],
  },
  {
    name: 'Calculator',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'Clock',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'TextEditor',
    relatedMainCategories: ['Utility'],
  },
  {
    name: 'Documentation',
  },
  {
    name: 'Adult',
  },
  {
    name: 'Core',
  },
  /*
  {
    name: 'KDE',
    relatedMainCategories: ['QT'],
  },
  {
    name: 'GNOME',
    relatedMainCategories: ['GTK'],
  },
  {
    name: 'XFCE',
    relatedMainCategories: ['GTK'],
  },
  {
    name: 'GTK',
  },
  {
    name: 'Qt',
  },
  */
  {
    name: 'Motif',
  },
  {
    name: 'Java',
  },
  {
    name: 'ConsoleOnly',
  },
];

export default freedesktopAdditionalCategories;
