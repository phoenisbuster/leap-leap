
cmake_minimum_required(VERSION 3.6)

set(lib_name PluginSdkboxAds)
set(target_name ext_${lib_name})

project(${lib_name})

#include(../../../../cocos2d/external/cmake/CocosExternalConfig.cmake)

add_library(${target_name} STATIC IMPORTED GLOBAL)

set_target_properties(${target_name} PROPERTIES
  INTERFACE_INCLUDE_DIRECTORIES "${CMAKE_CURRENT_SOURCE_DIR}/../"
)
if(ANDROID)
  if("${ANDROID_STL}" STREQUAL "c++_static")
      set(SDKBOX_LIBS_FOLDER libs_c++_static)
  else()
      set(SDKBOX_LIBS_FOLDER libs)
  endif()
  set_target_properties(${target_name} PROPERTIES
    IMPORTED_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/${SDKBOX_LIBS_FOLDER}/${ANDROID_ABI}/lib${lib_name}.a"
  )
endif()
