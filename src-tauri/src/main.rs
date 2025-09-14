// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::{State, Manager, AppHandle};
use tauri::{
  menu::{Menu, MenuItem},
  tray::{TrayIconBuilder, TrayIconEvent}
};


// Plugins
use tauri_plugin_updater::Builder as UpdaterBuilder;
use tauri_plugin_dialog::init as dialog_init;
use tauri_plugin_process::init as process_init;
use tauri_plugin_notification::{init as notification_init, NotificationExt};

#[derive(Default)]
struct AppState {
  notif_enabled: Mutex<bool>,
}

// Faire apparaitre la fenetre
fn show_window(app_handle: &AppHandle) {
  if let Some(window) = app_handle.get_webview_window("main") {
    let _ = window.show();
    let _ = window.set_focus();
  }
}

fn main() {
  tauri::Builder::default()
    .plugin(UpdaterBuilder::new().build())
    .plugin(dialog_init())
    .plugin(process_init())
    .plugin(notification_init())
    .setup(|app| {
      app.manage(AppState {
        notif_enabled: Mutex::new(true),
      });
      let quit_item = MenuItem::with_id(app,"quit", "Quit", true, None::<&str>)?;
      let notif_item = MenuItem::with_id(app, "notif", "Notifications ✅", true, None::<&str>)?;
      let show_item = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
      let notif_item_clone = notif_item.clone();
      let menu = Menu::with_items(app, &[&show_item,&notif_item, &quit_item])?;
      let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|app, event| match event {
          TrayIconEvent::DoubleClick { .. } => {
            show_window(&app.app_handle());
          }
          _ => {}
        })
        .on_menu_event(move |app, event| {
          if event.id.as_ref() == "quit" {
            app.exit(0);
          } else if event.id.as_ref() == "notif" {
            let state = app.state::<AppState>();
            let mut notif_enabled = state.notif_enabled.lock().unwrap();
            *notif_enabled = !*notif_enabled;
            if *notif_enabled {
              notif_item_clone.set_text("Notifications ✅").unwrap();
              app.notification().builder().title("Tout-Do").body("Notifications activées").show().unwrap();
            } else {
              notif_item_clone.set_text("Notifications ❌").unwrap();
            }
          } else if event.id.as_ref() == "show" {
            show_window(&app.app_handle());
          }
        })
        .build(app)?;
      if !app.notification().permission_state().is_ok() {
        app.notification().request_permission().unwrap();
      }
      app.notification()
        .builder()
        .title("Tout-Do")
        .body("L'application s'est lancé")
        .show()
        .unwrap();
      Ok(())
    })
    .on_window_event(|window, event| match event {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        #[cfg(not(target_os = "macos"))]{
          window.hide().unwrap();
        }
        #[cfg(target_os = "macos")]{
          tauri::AppHandle::hide(&window.app_handle()).unwrap();
        }
        api.prevent_close();
      }
      _ => {}
    })
    .invoke_handler(tauri::generate_handler![
    ])
    .run(tauri::generate_context!())
    .expect("Erreur au démarrage de l'application");
}
