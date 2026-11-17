import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, Users, Building2, FileText, ListChecks, Settings as SettingsIcon, Tv, TrendingUp, MessageCircle, Globe, MoreVertical, Edit2, GripVertical, Palette, Save, X, Calendar as CalendarIcon, DollarSign, FileSignature, Lock, GitBranch, FileSpreadsheet, Calculator } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const defaultNavigationItems = [
  { id: "dashboard", title: "Dashboard", url: "Dashboard", icon: Home },
  { id: "calendar", title: "Calendar", url: "Calendar", icon: CalendarIcon },
  { id: "messages", title: "Messages", url: "Messages", icon: MessageCircle },
  { id: "clients", title: "Clients", url: "Clients", icon: Users },
  { id: "properties", title: "Properties", url: "Properties", icon: Building2 },
  { id: "documents", title: "Documents", url: "Documents", icon: FileText },
  { id: "zipform", title: "ZipForm", url: "ZipForm", icon: FileSignature },
  { id: "interviews", title: "Soft Interviews", url: "InterviewTemplates", icon: ListChecks },
  { id: "expenses", title: "Expenses", url: "Expenses", icon: DollarSign },
  { id: "tasks", title: "Tasks", url: "Tasks", icon: ListChecks },
  { id: "templates", title: "Templates", url: "Templates", icon: ListChecks },
  { id: "passwords", title: "Passwords", url: "Passwords", icon: Lock },
  { id: "pipeline", title: "Pipeline", url: "Pipeline", icon: GitBranch },
  { id: "cma", title: "CMA Builder", url: "CMABuilder", icon: TrendingUp },
  { id: "settlement", title: "Settlement Sheet", url: "SettlementSheet", icon: Calculator },
  { id: "brightmls", title: "Bright MLS", url: "BrightMLS", icon: Globe },
  { id: "googledocs", title: "Google Docs", url: "GoogleDocsIntegration", icon: FileSpreadsheet },
];

const themes = {
  professional_blue: {
    name: "Professional Blue",
    sidebarBg: "from-slate-50 to-white",
    sidebarHeaderBg: "from-blue-600 to-blue-700",
    sidebarHeaderText: "text-white",
    activeItemBg: "from-blue-600 to-blue-700",
    activeItemText: "text-white",
    activeIconColor: "text-blue-200",
    hoverBg: "hover:bg-blue-50",
    textColor: "text-slate-700",
    borderColor: "border-slate-200",
    accentColor: "bg-blue-600"
  },
  executive_dark: {
    name: "Executive Dark",
    sidebarBg: "from-slate-900 to-slate-800",
    sidebarHeaderBg: "from-slate-950 to-slate-900",
    sidebarHeaderText: "text-white",
    activeItemBg: "from-emerald-600 to-emerald-700",
    activeItemText: "text-white",
    activeIconColor: "text-emerald-200",
    hoverBg: "hover:bg-slate-700",
    textColor: "text-slate-300",
    borderColor: "border-slate-700",
    accentColor: "bg-emerald-600"
  },
  luxury_gold: {
    name: "Luxury Gold",
    sidebarBg: "from-amber-50 to-orange-50",
    sidebarHeaderBg: "from-amber-600 to-orange-600",
    sidebarHeaderText: "text-white",
    activeItemBg: "from-amber-500 to-orange-500",
    activeItemText: "text-white",
    activeIconColor: "text-amber-100",
    hoverBg: "hover:bg-amber-100",
    textColor: "text-amber-900",
    borderColor: "border-amber-200",
    accentColor: "bg-amber-600"
  },
  modern_slate: {
    name: "Modern Slate",
    sidebarBg: "from-slate-100 to-slate-200",
    sidebarHeaderBg: "from-slate-700 to-slate-800",
    sidebarHeaderText: "text-white",
    activeItemBg: "from-slate-600 to-slate-700",
    activeItemText: "text-white",
    activeIconColor: "text-slate-200",
    hoverBg: "hover:bg-slate-300",
    textColor: "text-slate-900",
    borderColor: "border-slate-300",
    accentColor: "bg-slate-700"
  },
  premium_purple: {
    name: "Premium Purple",
    sidebarBg: "from-purple-50 to-indigo-50",
    sidebarHeaderBg: "from-purple-600 to-indigo-600",
    sidebarHeaderText: "text-white",
    activeItemBg: "from-purple-600 to-indigo-600",
    activeItemText: "text-white",
    activeIconColor: "text-purple-200",
    hoverBg: "hover:bg-purple-100",
    textColor: "text-purple-900",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-600"
  }
};

export default function Layout({ children }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    // Load cached user data immediately to prevent flickering
    const cached = localStorage.getItem('cached_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [navigationItems, setNavigationItems] = useState(defaultNavigationItems);
  const [editingItems, setEditingItems] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const cached = localStorage.getItem('cached_user');
    return cached ? (JSON.parse(cached).theme || "professional_blue") : "professional_blue";
  });

  useEffect(() => {
    loadUser();
    loadUnreadCount();
    
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
      
      // Cache user data to prevent flickering on navigation
      localStorage.setItem('cached_user', JSON.stringify(user));
      
      setSelectedTheme(user.theme || "professional_blue");
      
      // Load custom navigation
      if (user.navigation_customization?.items) {
        const customItems = [...defaultNavigationItems].map(item => {
          const custom = user.navigation_customization.items.find(c => c.id === item.id);
          return {
            ...item,
            title: custom?.custom_name || item.title,
            order: custom?.order !== undefined ? custom.order : defaultNavigationItems.indexOf(item)
          };
        }).sort((a, b) => (a.order || 0) - (b.order || 0));
        setNavigationItems(customItems);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) return; // If user is not authenticated, stop here.
      
      const messages = await base44.entities.Message.filter({ 
        recipient_id: user.id, 
        is_read: false 
      });
      setUnreadCount(messages.length);
    } catch (error) {
      // Silently fail - user might not be authenticated, or other transient error
    }
  };

  const openTVDashboard = () => {
    window.open(createPageUrl("TVDashboard"), '_blank', 'fullscreen=yes');
  };

  const handleOpenCustomize = () => {
    setEditingItems(navigationItems.map((item, index) => ({ ...item, order: index })));
    setShowCustomizeModal(true);
  };

  const handleSaveCustomization = async () => {
    const customization = {
      items: editingItems.map((item, index) => ({
        id: item.id,
        custom_name: item.title,
        order: index
      }))
    };

    await base44.auth.updateMe({
      navigation_customization: customization,
      theme: selectedTheme
    });

    setNavigationItems(editingItems);
    setShowCustomizeModal(false);
    loadUser();
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newItems = [...editingItems];
    const draggedItem = newItems[draggingIndex];
    newItems.splice(draggingIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setEditingItems(newItems);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleRenameItem = (index, newName) => {
    const newItems = [...editingItems];
    newItems[index] = { ...newItems[index], title: newName };
    setEditingItems(newItems);
  };

  const theme = themes[selectedTheme] || themes.professional_blue;
  const appName = currentUser?.app_name || "RealtyOS";
  const customColor = currentUser?.custom_theme_color || "#2563eb"; // Default to a blue if not set

  // If using custom theme, override theme colors by creating a new activeTheme object
  const activeTheme = selectedTheme === "custom" ? {
    ...theme, // Inherit base properties from the default theme (e.g., professional_blue)
    sidebarHeaderBg: `from-[${customColor}] to-[${customColor}]`, // These will be overridden by inline styles for gradients
    activeItemBg: `from-[${customColor}] to-[${customColor}]`,   // These will be overridden by inline styles for gradients
    accentColor: `bg-[${customColor}]`,                         // This will be overridden by inline styles
    activeIconColor: "text-white", // Ensure icons are visible on custom background
    sidebarHeaderText: "text-white", // Ensure header text is visible on custom background
  } : theme;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Sidebar className={`border-r ${activeTheme.borderColor} bg-gradient-to-b ${activeTheme.sidebarBg} shadow-2xl`}>
          <SidebarHeader 
            className={`border-b ${activeTheme.borderColor} p-6 bg-gradient-to-br ${activeTheme.sidebarHeaderBg}`}
            style={selectedTheme === "custom" ? { background: `linear-gradient(to bottom right, ${customColor}, ${customColor}e6)` } : undefined}
          >
            <div className="flex items-center gap-3">
              {currentUser?.company_logo ? (
                <img 
                  src={currentUser.company_logo} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain rounded-xl bg-white/10 backdrop-blur-md p-2 shadow-lg"
                />
              ) : (
                <div className={`w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg`}>
                  <Building2 className={`w-7 h-7 ${activeTheme.sidebarHeaderText}`} />
                </div>
              )}
              <div>
                <h2 className={`font-bold ${activeTheme.sidebarHeaderText} text-xl tracking-tight`}>{appName}</h2>
                <p className={`text-xs ${activeTheme.sidebarHeaderText} opacity-80 font-medium tracking-wide`}>Professional Suite</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className={`text-xs font-bold ${activeTheme.textColor} opacity-60 uppercase tracking-widest px-3 py-4 mb-1`}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === createPageUrl(item.url);
                    const isMessages = item.id === "messages";
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            transition-all duration-200 rounded-xl mb-1 group border border-transparent
                            ${isActive 
                              ? `bg-gradient-to-r ${activeTheme.activeItemBg} ${activeTheme.activeItemText} shadow-lg border-white/20` 
                              : `${activeTheme.hoverBg} ${activeTheme.textColor}`
                            }
                          `}
                          style={isActive && selectedTheme === "custom" ? { 
                            background: `linear-gradient(to right, ${customColor}, ${customColor}e6)`,
                            color: 'white'
                          } : undefined}
                        >
                          <Link to={createPageUrl(item.url)} className="flex items-center gap-3 px-4 py-3 relative">
                            <item.icon className={`w-5 h-5 ${isActive ? activeTheme.activeIconColor : `${activeTheme.textColor} opacity-70 group-hover:opacity-100`}`} />
                            <span className={`font-semibold text-sm`}>{item.title}</span>
                            {isMessages && unreadCount > 0 && (
                              <Badge className={`ml-auto ${activeTheme.accentColor} text-white px-2 py-0.5 text-xs shadow-md`}
                                style={selectedTheme === "custom" ? { backgroundColor: customColor } : undefined}
                              >
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={openTVDashboard}
                      className={`transition-all duration-200 rounded-xl mb-1 ${activeTheme.hoverBg} ${activeTheme.textColor} cursor-pointer group border border-transparent`}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <Tv className={`w-5 h-5 ${activeTheme.textColor} opacity-70 group-hover:opacity-100`} />
                        <span className="font-semibold text-sm">TV Dashboard</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className={`border-t ${activeTheme.borderColor} p-4`}>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className={`flex items-center gap-3 px-3 ${activeTheme.hoverBg} rounded-xl p-3 transition-all cursor-pointer shadow-md border ${activeTheme.borderColor} bg-white/50 backdrop-blur-sm`}>
                  <Avatar className={`w-11 h-11 border-2 ${activeTheme.borderColor} shadow-lg`}>
                    {currentUser?.profile_picture ? (
                      <AvatarImage src={currentUser.profile_picture} />
                    ) : (
                      <AvatarFallback className={`bg-gradient-to-br ${activeTheme.activeItemBg} text-white font-bold text-base`}
                        style={selectedTheme === "custom" ? { background: customColor } : undefined}
                      >
                        {currentUser?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`font-bold ${activeTheme.textColor} text-sm truncate`}>
                      {currentUser?.full_name || "User"}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${activeTheme.textColor} opacity-70 truncate font-medium`}>{currentUser?.role || "Agent"}</p>
                      <MoreVertical className={`w-3 h-3 ${activeTheme.textColor} opacity-50`} />
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-slate-200">
                <DropdownMenuItem onClick={handleOpenCustomize} className="cursor-pointer py-3">
                  <Palette className="w-4 h-4 mr-3" />
                  Customize Navigation
                </DropdownMenuItem>
                <Link to={createPageUrl("Settings")}>
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <SettingsIcon className="w-4 h-4 mr-3" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => base44.auth.logout()} className="cursor-pointer py-3 text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 lg:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors" />
              <h1 className="text-xl font-bold text-slate-900">{appName}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {children}
          </div>
        </main>
      </div>

      {/* Customize Navigation Modal */}
      <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Customize Navigation & Theme</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Choose Your Theme
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(themes).map(([key, themeData]) => (
                  <Card 
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedTheme === key ? 'border-blue-600 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${themeData.sidebarHeaderBg} shadow-lg`} />
                        <div>
                          <h4 className="font-bold text-slate-900">{themeData.name}</h4>
                          {selectedTheme === key && (
                            <Badge className="mt-1 bg-blue-600">Selected</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className={`w-8 h-8 rounded bg-gradient-to-br ${themeData.activeItemBg}`} />
                        <div className={`w-8 h-8 rounded bg-gradient-to-br ${themeData.sidebarBg}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Navigation Reorder */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                Reorder & Rename Navigation Items
              </h3>
              <p className="text-sm text-slate-600 mb-4">Drag items to reorder, click names to rename</p>
              
              <div className="space-y-2">
                {editingItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-white border-2 rounded-lg transition-all ${
                      draggingIndex === index ? 'border-blue-500 shadow-lg opacity-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                    <item.icon className="w-5 h-5 text-slate-600" />
                    <Input
                      value={item.title}
                      onChange={(e) => handleRenameItem(index, e.target.value)}
                      className="flex-1 font-semibold"
                    />
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSaveCustomization} className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
              <Button onClick={() => setShowCustomizeModal(false)} variant="outline" className="h-12">
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
