import React, { useState } from 'react';
import { BookOpen, Search, Filter, Star, Clock, User, Calendar, MapPin, X, Check, QrCode, BookMarked, TrendingUp, Award, Sparkles, ChevronRight } from 'lucide-react';
import CollegeInfo from '../Components/CollegeInfo';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showMyBooks, setShowMyBooks] = useState(false);
  const [bookReceived, setBookReceived] = useState(false);

  const categories = [
    { id: 'all', name: 'All Books', icon: '📚' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'mathematics', name: 'Mathematics', icon: '📐' },
    { id: 'literature', name: 'Literature', icon: '📖' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'engineering', name: 'Engineering', icon: '⚙️' }
  ];

  const books = [
    { 
      id: 1, 
      title: 'Clean Code', 
      author: 'Robert C. Martin', 
      category: 'programming', 
      rating: 4.8, 
      available: 5,
      total: 10,
      shelf: 'A-23',
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      year: 2008,
      pages: 464,
      cover: '📘',
      description: 'A handbook of agile software craftsmanship'
    },
    { 
      id: 2, 
      title: 'Introduction to Algorithms', 
      author: 'Thomas H. Cormen', 
      category: 'programming', 
      rating: 4.9, 
      available: 3,
      total: 8,
      shelf: 'A-15',
      isbn: '978-0262033848',
      publisher: 'MIT Press',
      year: 2009,
      pages: 1292,
      cover: '📕',
      description: 'Comprehensive text on algorithms'
    },
    { 
      id: 3, 
      title: 'The Pragmatic Programmer', 
      author: 'Andrew Hunt', 
      category: 'programming', 
      rating: 4.7, 
      available: 7,
      total: 12,
      shelf: 'A-18',
      isbn: '978-0135957059',
      publisher: 'Addison-Wesley',
      year: 2019,
      pages: 352,
      cover: '📗',
      description: 'Your journey to mastery'
    },
    { 
      id: 4, 
      title: 'A Brief History of Time', 
      author: 'Stephen Hawking', 
      category: 'science', 
      rating: 4.6, 
      available: 8,
      total: 15,
      shelf: 'B-12',
      isbn: '978-0553380163',
      publisher: 'Bantam',
      year: 1988,
      pages: 256,
      cover: '📙',
      description: 'From Big Bang to black holes'
    },
    { 
      id: 5, 
      title: 'Sapiens', 
      author: 'Yuval Noah Harari', 
      category: 'history', 
      rating: 4.8, 
      available: 4,
      total: 10,
      shelf: 'C-08',
      isbn: '978-0062316097',
      publisher: 'Harper',
      year: 2015,
      pages: 464,
      cover: '📔',
      description: 'A brief history of humankind'
    },
    { 
      id: 6, 
      title: 'Calculus: Early Transcendentals', 
      author: 'James Stewart', 
      category: 'mathematics', 
      rating: 4.5, 
      available: 6,
      total: 12,
      shelf: 'D-05',
      isbn: '978-1285741550',
      publisher: 'Cengage',
      year: 2015,
      pages: 1368,
      cover: '📓',
      description: 'Comprehensive calculus textbook'
    },
    { 
      id: 7, 
      title: '1984', 
      author: 'George Orwell', 
      category: 'literature', 
      rating: 4.9, 
      available: 2,
      total: 8,
      shelf: 'E-11',
      isbn: '978-0451524935',
      publisher: 'Signet',
      year: 1949,
      pages: 328,
      cover: '📖',
      description: 'Dystopian social science fiction'
    },
    { 
      id: 8, 
      title: 'Design Patterns', 
      author: 'Gang of Four', 
      category: 'programming', 
      rating: 4.7, 
      available: 4,
      total: 9,
      shelf: 'A-20',
      isbn: '978-0201633610',
      publisher: 'Addison-Wesley',
      year: 1994,
      pages: 416,
      cover: '📘',
      description: 'Elements of reusable object-oriented software'
    },
    { 
      id: 9, 
      title: 'Fundamentals of Engineering', 
      author: 'Michael R. Lindeburg', 
      category: 'engineering', 
      rating: 4.6, 
      available: 5,
      total: 10,
      shelf: 'F-03',
      isbn: '978-1591264422',
      publisher: 'PPI',
      year: 2018,
      pages: 1456,
      cover: '📕',
      description: 'Complete engineering reference'
    },
    { 
      id: 10, 
      title: 'The Origin of Species', 
      author: 'Charles Darwin', 
      category: 'science', 
      rating: 4.8, 
      available: 6,
      total: 10,
      shelf: 'B-16',
      isbn: '978-0451529060',
      publisher: 'Signet',
      year: 1859,
      pages: 576,
      cover: '📗',
      description: 'Foundation of evolutionary biology'
    }
  ];

  const issueBook = (book) => {
    const booking = {
      id: `LIB${Date.now().toString().slice(-6)}`,
      book: book,
      issueDate: new Date().toLocaleDateString(),
      issueTime: new Date().toLocaleTimeString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      qrCode: `QR${Date.now().toString().slice(-8)}`,
      status: 'pending'
    };
    
    setBookingDetails(booking);
    setBookingSuccess(true);
    setShowIssueModal(false);
    setIssuedBooks([...issuedBooks, booking]);
  };

  const simulateBookCollection = () => {
    setBookReceived(true);
    const updatedBooking = { ...bookingDetails, status: 'collected' };
    setIssuedBooks(issuedBooks.map(b => b.id === bookingDetails.id ? updatedBooking : b));
    
    setTimeout(() => {
      setBookReceived(false);
      setBookingSuccess(false);
      setBookingDetails(null);
    }, 5000);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pendingBooks = issuedBooks.filter(b => b.status === 'pending');
  const collectedBooks = issuedBooks.filter(b => b.status === 'collected');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-blue-700 bg-clip-text text-transparent">
                  Digital Library
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>24/7 Digital Access</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowMyBooks(true)}
              className="relative px-4 py-2 bg-blue-700  text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2"
            >
              <BookMarked className="w-5 h-5" />
              <span className="hidden sm:inline">My Books</span>
              {issuedBooks.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {issuedBooks.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/*Banner*/}
      <CollegeInfo/>

      {/* Book Collection Success */}
      {bookReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Collected!</h2>
            <p className="text-gray-600 mb-4">Enjoy your reading. Please return by the due date.</p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">{bookingDetails?.book.title}</p>
              <p className="text-green-600 text-sm">Due: {bookingDetails?.dueDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingSuccess && !bookReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-2">Show this QR code at the library counter</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <div className="text-4xl font-bold text-gray-800">{bookingDetails?.qrCode}</div>
                  </div>
                  <p className="text-xs text-gray-500">Booking ID: {bookingDetails?.id}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{bookingDetails?.book.cover}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{bookingDetails?.book.title}</h3>
                    <p className="text-sm text-gray-600">{bookingDetails?.book.author}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold">{bookingDetails?.issueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-red-600">{bookingDetails?.dueDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shelf Location:</span>
                    <span className="font-semibold">{bookingDetails?.book.shelf}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={simulateBookCollection}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Simulate QR Scan (Demo)</span>
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Books must be returned within 14 days. Late returns may result in fines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Books Sidebar */}
      {showMyBooks && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Books</h2>
                <button
                  onClick={() => setShowMyBooks(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-2">{issuedBooks.length} books issued</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {issuedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-gray-500">No books issued yet</p>
                  <p className="text-sm text-gray-400 mt-2">Browse and issue books to see them here</p>
                </div>
              ) : (
                <>
                  {pendingBooks.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span>Pending Collection ({pendingBooks.length})</span>
                      </h3>
                      {pendingBooks.map((booking) => (
                        <div key={booking.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-3">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-3xl">{booking.book.cover}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{booking.book.title}</h4>
                              <p className="text-sm text-gray-600">{booking.book.author}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>Booking ID: {booking.id}</span>
                            <span>Shelf: {booking.book.shelf}</span>
                          </div>
                          <div className="bg-white rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-gray-800">{booking.qrCode}</div>
                            <p className="text-xs text-gray-500">Show at counter</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {collectedBooks.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>Collected ({collectedBooks.length})</span>
                      </h3>
                      {collectedBooks.map((booking) => (
                        <div key={booking.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-3xl">{booking.book.cover}</div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{booking.book.title}</h4>
                              <p className="text-sm text-gray-600">{booking.book.author}</p>
                            </div>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                            <p className="text-xs text-red-600">Due: <strong>{booking.dueDate}</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {showIssueModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Book Details</h2>
                <button
                  onClick={() => {
                    setShowIssueModal(false);
                    setSelectedBook(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-6 mb-6">
                <div className="text-8xl">{selectedBook.cover}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h3>
                  <p className="text-lg text-gray-600 mb-3">{selectedBook.author}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{selectedBook.rating}</span>
                    </div>
                    <div className={`px-3 py-1 rounded font-semibold ${
                      selectedBook.available > 0 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedBook.available > 0 
                        ? `${selectedBook.available} Available` 
                        : 'Not Available'}
                    </div>
                  </div>
                  <p className="text-gray-600">{selectedBook.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">ISBN:</span>
                    <span className="font-semibold text-sm">{selectedBook.isbn}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Publisher:</span>
                    <span className="font-semibold text-sm">{selectedBook.publisher}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 text-sm">Year:</span>
                    <span className="font-semibold text-sm">{selectedBook.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Pages:</span>
                    <span className="font-semibold text-sm">{selectedBook.pages}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Shelf Location:</span>
                    <span className="font-semibold text-sm">{selectedBook.shelf}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Total Copies:</span>
                    <span className="font-semibold text-sm">{selectedBook.total}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm text-gray-600">Issue Period:</span>
                    <span className="font-semibold text-sm">14 Days</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => issueBook(selectedBook)}
                disabled={selectedBook.available === 0}
                className={`w-full py-4 rounded-lg font-semibold transition ${
                  selectedBook.available > 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedBook.available > 0 ? 'Issue This Book' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{books.length}</div>
                <div className="text-xs text-gray-600">Total Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {books.reduce((sum, book) => sum + book.available, 0)}
                </div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{issuedBooks.length}</div>
                <div className="text-xs text-gray-600">My Issues</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingBooks.length}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

                {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
            >
              {/* Card Header */}
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="text-5xl">{book.cover}</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.available > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {book.available > 0 ? "Available" : "Unavailable"}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-4 group-hover:text-indigo-600 transition">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold text-gray-800">{book.rating}</span>
                  </div>
                  <div className="text-gray-600">
                    Shelf: <span className="font-semibold">{book.shelf}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {book.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {book.total} Copies
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    14 Days
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowIssueModal(true);
                  }}
                  disabled={book.available === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    book.available > 0
                      ? "bg-blue-700 text-white hover:shadow-lg cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  {book.available > 0 ? "Issue Digitally" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
    </div>
    
    )
}
