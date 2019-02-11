
using System;
using System.Linq;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

public class Startup
{

  [DllImport("user32.dll")]
  public static extern IntPtr GetWindowRect(IntPtr hWnd, ref Rect rect);

  [DllImport("user32.dll", CharSet = CharSet.Unicode)]
  public static extern int GetWindowText(IntPtr hWnd, StringBuilder strText, int maxCount);

  [DllImport("user32.dll", CharSet = CharSet.Unicode)]
  public static extern int GetWindowTextLength(IntPtr hWnd);

  [DllImport("user32.dll")]
  public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

  [StructLayout(LayoutKind.Sequential)]
  public struct Rect
  {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
  }

  public static Rect WindowBounds(IntPtr handle)
  {
    Rect rect = new Rect();
    GetWindowRect(handle, ref rect);
    return rect;
  }

  public static string GetWindowText(IntPtr hWnd)
  {
    int size = GetWindowTextLength(hWnd);
    if (size > 0)
    {
      var builder = new StringBuilder(size + 1);
      GetWindowText(hWnd, builder, builder.Capacity);
      return builder.ToString();
    }

    return String.Empty;
  }

  public static List<IntPtr> FindWindowsWithText(string titleText)
  {
    return FindWindows(delegate(IntPtr wnd, IntPtr param)
    {
      return GetWindowText(wnd).Contains(titleText);
    });
  } 
  
  public static List<IntPtr> FindWindows(EnumWindowsProc filter)
  {
    IntPtr found = IntPtr.Zero;
    List<IntPtr> windows = new List<IntPtr>();

    EnumWindows(delegate(IntPtr wnd, IntPtr param)
    {
        if (filter(wnd, param))
        {
            // only add the windows that pass the filter
            windows.Add(wnd);
        }

        // but return true here so that we iterate all windows
        return true;
    }, IntPtr.Zero);

    return windows;
  }

  public async Task<object> Invoke(string windowTitle)
  {
    return FindWindowsWithText(windowTitle).Select(w => {
      Rect bounds = WindowBounds(w);

      return new { 
        Left = bounds.Left, 
        Right = bounds.Right, 
        Top = bounds.Top,
        Bottom = bounds.Bottom,
        Name = GetWindowText(w)
      };
    });
  }
}